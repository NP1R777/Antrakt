from django.db import migrations


# Старые шаблоны → новые с явными падежными плейсхолдерами.
GREETING_REPLACEMENTS = [
    (
        "Сегодня день рождения у {name}! 🎉 Коллектив Норильского народного театра "
        "от всей души поздравляет и желает вдохновения, ярких ролей и оваций!",
        "Сегодня день рождения у {name_gen}! 🎉 Коллектив Норильского народного театра "
        "от всей души поздравляет и желает вдохновения, ярких ролей и оваций!",
    ),
    (
        "Поздравляем {name} с днём рождения! 🌟 Желаем творческих успехов, "
        "крепкого здоровья и незабываемых премьер!",
        "Поздравляем {name_acc} с днём рождения! 🌟 Желаем творческих успехов, "
        "крепкого здоровья и незабываемых премьер!",
    ),
]


def forwards(apps, schema_editor):
    BirthdayGreeting = apps.get_model('my_app1', 'BirthdayGreeting')
    for old, new in GREETING_REPLACEMENTS:
        BirthdayGreeting.objects.filter(text=old).update(text=new)


def backwards(apps, schema_editor):
    BirthdayGreeting = apps.get_model('my_app1', 'BirthdayGreeting')
    for old, new in GREETING_REPLACEMENTS:
        BirthdayGreeting.objects.filter(text=new).update(text=old)


class Migration(migrations.Migration):

    dependencies = [
        ('my_app1', '0019_reconcile_achievements_images_list'),
    ]

    operations = [
        migrations.RunPython(forwards, backwards),
    ]
