from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('my_app1', '0017_perfomances_guest_director_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='actors',
            name='gender_override',
            field=models.CharField(
                blank=True,
                choices=[('male', 'Актёр'), ('female', 'Актриса')],
                default=None,
                max_length=10,
                null=True,
            ),
        ),
    ]
