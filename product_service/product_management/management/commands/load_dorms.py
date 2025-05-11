import json
from django.core.management.base import BaseCommand
from product_management.models import Dorm, DormImage, RoomType, RoomImage


class Command(BaseCommand):
    help = 'Load dorms and nested room types from JSON'

    def handle(self, *args, **kwargs):
        with open('product_management/response.json', encoding='utf-8') as f:
            dorms = json.load(f)["data"]

        # ถ้าเป็น list of dorms
        if isinstance(dorms, dict):
            dorms = [dorms]

        for dorm_data in dorms:
            dorm, created = Dorm.objects.get_or_create(
                name=dorm_data['name'],
                defaults={
                    'zone': dorm_data['zone'],
                    'description': dorm_data['description'],
                    'location_embed': dorm_data['location_embed'],
                }
            )

            # รูปหอพัก
            for img in dorm_data.get('images', []):
                if not DormImage.objects.filter(dorm=dorm, image_url=img['image_url']).exists():
                    DormImage.objects.create(dorm=dorm, image_url=img['image_url'])

            # Room types
            for rt in dorm_data.get('room_types', []):
                room_type = RoomType.objects.create(
                    dorm=dorm,
                    type_name=rt['type_name'],
                    price_per_month=rt['price_per_month'],
                    size_sqm=rt['size_sqm'],
                    is_available=rt['is_available'],
                    description=rt['description'],
                )

                # Room type images
                for rt_img in rt.get('images', []):
                    RoomImage.objects.create(room_type=room_type, image_url=rt_img['image_url'])

            self.stdout.write(self.style.SUCCESS(f"✔ Loaded dorm: {dorm.name}"))