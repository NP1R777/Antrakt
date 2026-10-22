from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('my_app1', '0023_archive_afisha_hold')]

    operations = [
        migrations.AddField(
            model_name='user', name='auth_version',
            field=models.PositiveBigIntegerField(default=0, editable=False),
        ),
    ]
