# Generated by Django 5.0.4 on 2025-05-04 13:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product_management', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='roomimage',
            name='image_url',
        ),
        migrations.AddField(
            model_name='roomimage',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='room_images/'),
        ),
    ]
