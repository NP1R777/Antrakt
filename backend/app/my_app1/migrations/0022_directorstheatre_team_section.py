from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('my_app1', '0021_perfomances_afisha_hold'),
    ]

    operations = [
        migrations.AddField(
            model_name='directorstheatre',
            name='team_section',
            field=models.CharField(
                choices=[
                    ('artistic_director', 'Художественные руководители'),
                    ('director', 'Режиссёры'),
                ],
                default='artistic_director',
                help_text='В какую секцию на странице «Команда» попадает человек.',
                max_length=32,
            ),
        ),
    ]
