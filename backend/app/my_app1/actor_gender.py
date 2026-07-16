import re


ROLE_LABELS = {
    'male': 'Актёр',
    'female': 'Актриса',
}

MALE_GIVEN_NAMES = {
    'илья', 'никита', 'лука', 'кузьма', 'фома', 'савва', 'данила',
}

FEMALE_GIVEN_NAMES = {
    'зайнап', 'гузель', 'гузел', 'любовь', 'нинэль', 'нинель',
    'рашель', 'эсфирь', 'юдифь',
}

FEMALE_SURNAME_RE = re.compile(
    r'(?:ова|ёва|ева|ина|ына|ская|цкая|ая)$',
    re.IGNORECASE,
)
MALE_SURNAME_RE = re.compile(
    r'(?:ов|ёв|ев|ин|ын|ский|цкий|ой|ый|ий)$',
    re.IGNORECASE,
)


def infer_actor_gender(full_name):
    """Infer gender from both given name and surname.

    Names in historical data may be stored as either «Фамилия Имя» or
    «Имя Фамилия», so every token participates in the decision.
    """
    tokens = [
        token.casefold()
        for token in re.findall(r"[A-Za-zА-Яа-яЁё-]+", full_name or '')
        if token
    ]
    if not tokens:
        return 'male'

    if any(token in MALE_GIVEN_NAMES for token in tokens):
        return 'male'
    if any(token in FEMALE_GIVEN_NAMES for token in tokens):
        return 'female'

    # A clearly gendered surname is a strong signal regardless of name order.
    if any(FEMALE_SURNAME_RE.search(token) for token in tokens):
        return 'female'
    if any(MALE_SURNAME_RE.search(token) for token in tokens):
        return 'male'

    # Typical Russian feminine given names end in «а»/«я». Check all tokens
    # because old rows do not consistently use the same order.
    if any(token.endswith(('а', 'я')) for token in tokens):
        return 'female'

    return 'male'


def actor_role_label(full_name, gender_override=None):
    gender = gender_override or infer_actor_gender(full_name)
    return ROLE_LABELS.get(gender, ROLE_LABELS['male'])
