from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('my_app1', '0022_directorstheatre_team_section'),
    ]

    operations = [
        migrations.AddField(
            model_name='archive',
            name='afisha_hold',
            field=models.BooleanField(default=False),
        ),
    ]
