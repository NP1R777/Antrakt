from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('my_app1', '0020_update_birthday_greeting_placeholders'),
    ]

    operations = [
        migrations.AddField(
            model_name='perfomances',
            name='afisha_hold',
            field=models.BooleanField(default=False),
        ),
    ]
