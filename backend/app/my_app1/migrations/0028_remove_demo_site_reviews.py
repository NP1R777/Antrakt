import datetime
from django.db import migrations

# Точные исходные значения 0016: никогда не удалять по одному имени.
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


def cleanup(apps, schema_editor):
    Review = apps.get_model('my_app1', 'SiteReview')
    for name, role, text, date in SEED:
        Review.objects.filter(
            author_name=name, role=role, text=text, review_date=date,
            source='manual', rating=5, avatar_url='', source_url='',
            vk_owner_id__isnull=True, vk_post_id__isnull=True, vk_comment_id__isnull=True,
        ).delete()
    Review.objects.filter(source='vk').update(rating=None)


class Migration(migrations.Migration):
    dependencies = [('my_app1', '0027_vk_import_jobs')]
    operations = [migrations.RunPython(cleanup, migrations.RunPython.noop)]
