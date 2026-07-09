import datetime
from django.db import migrations


# Переносим прежние статичные отзывы с главной в БД (без названия спектакля),
# чтобы секция сразу была наполнена; парсер ВК далее добавит настоящие отзывы.
SEED = [
    ("Мария Иванова", "Зритель",
     "Посетили спектакль с дочерью. Были потрясены игрой актёров и глубиной "
     "проработки персонажей. Обязательно придём ещё!", datetime.date(2025, 6, 15)),
    ("Алексей Петров", "Студент театрального",
     "Учусь актёрскому мастерству в этой студии уже полгода. Преподаватели — "
     "профессионалы высшего уровня. Особенно рекомендую курс сценической речи!",
     datetime.date(2025, 6, 12)),
    ("Ольга Сидорова", "Театральный критик",
     "Свежий взгляд на классику. Современные решения не нарушили дух оригинала, "
     "а лишь усилили его.", datetime.date(2025, 6, 10)),
    ("Дмитрий Козлов", "Родитель",
     "Мой сын занимается в детской группе студии. Заметны огромные изменения в "
     "его уверенности и коммуникативных навыках. Спасибо педагогам!",
     datetime.date(2025, 6, 8)),
    ("Екатерина Волкова", "Актриса",
     "Уровень постановок здесь не уступает многим профессиональным театрам. "
     "Особенно впечатлили декорации и свет.", datetime.date(2025, 6, 5)),
    ("Артём Фёдоров", "Режиссёр",
     "Работал со студией над совместным проектом. Поразила дисциплина и "
     "преданность делу всех участников. Настоящие профессионалы!",
     datetime.date(2025, 6, 1)),
]


def seed(apps, schema_editor):
    SiteReview = apps.get_model('my_app1', 'SiteReview')
    if SiteReview.objects.exists():
        return
    for name, role, text, date in SEED:
        SiteReview.objects.create(
            author_name=name, role=role, text=text, review_date=date,
            rating=5, source='manual',
        )


def unseed(apps, schema_editor):
    SiteReview = apps.get_model('my_app1', 'SiteReview')
    SiteReview.objects.filter(source='manual',
                              author_name__in=[s[0] for s in SEED]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('my_app1', '0015_vkparserstate_sitereview'),
    ]

    operations = [
        migrations.RunPython(seed, unseed),
    ]
