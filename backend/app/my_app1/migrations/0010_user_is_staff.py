# Generated by Django 5.2.3 on 2025-07-08 03:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('my_app1', '0009_user_is_superuser'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_staff',
            field=models.BooleanField(default=False),
        ),
    ]
