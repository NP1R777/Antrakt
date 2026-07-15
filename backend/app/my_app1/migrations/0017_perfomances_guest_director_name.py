from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('my_app1', '0016_seed_site_reviews'),
    ]

    operations = [
        migrations.AddField(
            model_name='perfomances',
            name='guest_director_name',
            field=models.CharField(
                blank=True,
                default='',
                help_text='Имя режиссёра не из базы («Другой(-ая)»).',
                max_length=100,
            ),
        ),
    ]
