# Generated by Django 5.2.3 on 2025-07-03 12:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('my_app1', '0004_perfomances_image_url'),
    ]

    operations = [
        migrations.AlterField(
            model_name='actors',
            name='deleted_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
