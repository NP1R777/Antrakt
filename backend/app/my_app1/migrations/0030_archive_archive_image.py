# Generated by Django 5.2.3 on 2025-07-18 07:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('my_app1', '0029_perfomances_ticket_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='archive',
            name='archive_image',
            field=models.URLField(blank=True, null=True),
        ),
    ]
