# Generated by Django 5.2.3 on 2025-07-16 12:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('my_app1', '0027_news_images_list'),
    ]

    operations = [
        migrations.AddField(
            model_name='news',
            name='date_publish',
            field=models.DateField(blank=True, null=True),
        ),
    ]
