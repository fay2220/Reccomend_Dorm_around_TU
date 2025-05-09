from rest_framework import serializers
from product_management.models import Dorm, DormImage, RoomType, RoomImage

class RoomImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomImage
        fields = ['image_url']

class RoomTypeSerializer(serializers.ModelSerializer):
    images = RoomImageSerializer(many=True)

    class Meta:
        model = RoomType
        fields = ['type_name', 'price_per_month', 'size_sqm', 'is_available', 'description', 'images']

class DormImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DormImage
        fields = ['image_url']

class DormSerializer(serializers.ModelSerializer):
    images = DormImageSerializer(many=True)
    room_types = RoomTypeSerializer(many=True)

    class Meta:
        model = Dorm
        fields = ["id", "zone", "name", "description", "images", "room_types", "location_embed"] 

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        room_types_data = validated_data.pop('room_types', [])

        dorm = Dorm.objects.create(**validated_data)

        for image in images_data:
            DormImage.objects.create(dorm=dorm, **image)

        for room_type in room_types_data:
            room_images = room_type.pop('images', [])
            rt = RoomType.objects.create(dorm=dorm, **room_type)
            for img in room_images:
                RoomImage.objects.create(room_type=rt, **img)

        return dorm

    def update(self, instance, validated_data):
        images_data = validated_data.pop('images', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        old_images = list(instance.images.all())
        for idx, image_data in enumerate(images_data):
            if idx < len(old_images):
                old_images[idx].image_url = image_data.get("image_url", old_images[idx].image_url)
                old_images[idx].save()
            else:
                DormImage.objects.create(dorm=instance, **image_data)

        return instance