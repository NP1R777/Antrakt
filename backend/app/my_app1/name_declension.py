"""Склонение русских ФИО для текстов поздравлений.

Использует pytrovich (правила Петровича) + эвристику порядка «Имя Фамилия» /
«Фамилия Имя», т.к. в данных встречаются оба варианта.
"""
from __future__ import annotations

import re

from pytrovich.enums import Case, Gender, NamePart
from pytrovich.maker import PetrovichDeclinationMaker

from .actor_gender import (
    FEMALE_SURNAME_RE,
    MALE_GIVEN_NAMES,
    MALE_SURNAME_RE,
    FEMALE_GIVEN_NAMES,
    infer_actor_gender,
)

_TOKEN_RE = re.compile(r"[A-Za-zА-Яа-яЁё-]+")
_maker: PetrovichDeclinationMaker | None = None

_CASE_BY_PLACEHOLDER = {
    'name': Case.NOMINATIVE,
    'name_nom': Case.NOMINATIVE,
    'name_gen': Case.GENITIVE,
    'name_acc': Case.ACCUSATIVE,
    'name_dat': Case.DATIVE,
}

_PLACEHOLDER_RE = re.compile(
    r'\{(name(?:_nom|_gen|_acc|_dat)?)\}'
)


def _get_maker() -> PetrovichDeclinationMaker:
    global _maker
    if _maker is None:
        _maker = PetrovichDeclinationMaker()
    return _maker


def _to_petrovich_gender(gender: str) -> Gender:
    return Gender.FEMALE if gender == 'female' else Gender.MALE


def _looks_like_surname(token: str) -> bool:
    fold = token.casefold()
    return bool(FEMALE_SURNAME_RE.search(fold) or MALE_SURNAME_RE.search(fold))


def _looks_like_given_name(token: str) -> bool:
    fold = token.casefold()
    if fold in MALE_GIVEN_NAMES or fold in FEMALE_GIVEN_NAMES:
        return True
    # Типичные русские имена: женские на а/я, мужские на согласную / й / ь.
    if fold.endswith(('а', 'я')) and not _looks_like_surname(token):
        return True
    return False


def parse_person_name(full_name: str) -> tuple[str | None, str | None, str | None]:
    """Вернуть (имя, фамилия, отчество) из строки полного имени."""
    tokens = _TOKEN_RE.findall(full_name or '')
    if not tokens:
        return None, None, None
    if len(tokens) == 1:
        return tokens[0], None, None
    if len(tokens) == 2:
        a, b = tokens
        a_sur, b_sur = _looks_like_surname(a), _looks_like_surname(b)
        a_given, b_given = _looks_like_given_name(a), _looks_like_given_name(b)
        if a_sur and not b_sur:
            return b, a, None
        if b_sur and not a_sur:
            return a, b, None
        if a_given and not b_given:
            return a, b, None
        if b_given and not a_given:
            return b, a, None
        # По умолчанию считаем порядок «Имя Фамилия».
        return a, b, None
    # 3+ токена: пробуем «Фамилия Имя Отчество» vs «Имя Отчество Фамилия».
    if _looks_like_surname(tokens[0]) and not _looks_like_surname(tokens[1]):
        return tokens[1], tokens[0], tokens[2]
    if _looks_like_surname(tokens[-1]):
        return tokens[0], tokens[-1], tokens[1]
    return tokens[0], tokens[-1], tokens[1]


def decline_full_name(full_name: str, case: Case, gender: str | None = None) -> str:
    """Склонить полное имя в нужный падеж, сохраняя исходный порядок слов."""
    raw = (full_name or '').strip()
    if not raw:
        return ''
    gender = gender or infer_actor_gender(raw)
    first, last, middle = parse_person_name(raw)
    maker = _get_maker()
    pg = _to_petrovich_gender(gender)

    declined = {}
    if first:
        declined[first] = maker.make(NamePart.FIRSTNAME, pg, case, first)
    if last:
        declined[last] = maker.make(NamePart.LASTNAME, pg, case, last)
    if middle:
        declined[middle] = maker.make(NamePart.MIDDLENAME, pg, case, middle)

    # Подменяем токены в исходной строке, чтобы сохранить порядок «Фамилия Имя».
    def repl(match: re.Match) -> str:
        token = match.group(0)
        return declined.get(token, token)

    return _TOKEN_RE.sub(repl, raw)


def _contextual_case_for_name(template: str) -> Case:
    """Если в шаблоне только {name}, выбрать падеж по окружению."""
    # Не используем \b сразу после }, т.к. } — не «слово» и граница ломается.
    if re.search(r'(?i)\bу\s+\{name\}(?!\w)', template):
        return Case.GENITIVE
    if re.search(r'(?i)Поздравляем\s+\{name\}(?!\w)', template):
        return Case.ACCUSATIVE
    if re.search(r'(?i)с\s+дн[её]м\s+рождения\s+\{name\}(?!\w)', template):
        return Case.ACCUSATIVE
    if re.search(r'(?i)поздравления\s+\{name\}(?!\w)', template):
        return Case.DATIVE
    # «С днём рождения, {name}!» и прочие обращения — именительный.
    return Case.NOMINATIVE


def format_greeting(template: str, full_name: str, gender: str | None = None) -> str:
    """Подставить склонения имени в шаблон поздравления.

    Поддерживаемые плейсхолдеры:
      {name} / {name_nom} — именительный
      {name_gen} — родительный (у кого)
      {name_acc} — винительный (кого поздравляем)
      {name_dat} — дательный
    """
    text = template or ''
    if not text:
        return ''
    gender = gender or infer_actor_gender(full_name)
    has_explicit = any(
        f'{{{key}}}' in text
        for key in ('name_nom', 'name_gen', 'name_acc', 'name_dat')
    )

    def replace_match(match: re.Match) -> str:
        key = match.group(1)
        if key == 'name' and not has_explicit:
            case = _contextual_case_for_name(text)
        else:
            case = _CASE_BY_PLACEHOLDER.get(key, Case.NOMINATIVE)
        return decline_full_name(full_name, case, gender)

    return _PLACEHOLDER_RE.sub(replace_match, text)
