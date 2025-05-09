import json
from django.core.management.base import BaseCommand
from product_management.models import Dorm, DormImage, RoomType, RoomImage

class Command(BaseCommand):
    help = 'Load dorm data from response.json'

    def handle(self, *args, **kwargs):
        with open('product_management/response.json', 'r', encoding='utf-8') as file:
            json_data = json.load(file)

        for dorm_data in json_data['data']:
            dorm, created = Dorm.objects.get_or_create(
                id=dorm_data['id'],
                defaults={
                    'zone': dorm_data['zone'],
                    'name': dorm_data['name'],
                    'description': dorm_data['description'],
                    'location_embed': dorm_data['location_embed'],
                }
            )

            for img in dorm_data['images']:
                DormImage.objects.create(dorm=dorm, image_url=img['image_url'])

            for room_data in dorm_data['room_types']:
                room = RoomType.objects.create(
                    dorm=dorm,
                    type_name=room_data['type_name'],
                    price_per_month=room_data['price_per_month'],
                    size_sqm=room_data['size_sqm'],
                    is_available=room_data['is_available'],
                    description=room_data['description'],
                )
                for img in room_data['images']:
                    RoomImage.objects.create(room_type=room, image_url=img['image_url'])