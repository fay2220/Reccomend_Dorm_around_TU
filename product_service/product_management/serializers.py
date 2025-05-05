from rest_framework import serializers
from product_management.models import Dorm,DormImage,RoomType,RoomImage

class RoomImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomImage
        fields = ['image_url']  # อย่าใช้ 'image' ถ้าใน model ใช้ชื่อ 'image_url'

class RoomTypeSerializer(serializers.ModelSerializer):
    images = RoomImageSerializer(many=True)

    class Meta:
        model = RoomType
        fields = ['type_name', 'price_per_month', 'size_sqm', 'is_available', 'description', 'images']

    
class DormImageSerializer(serializers.ModelSerializer):
    class Meta:
        model  = DormImage
        fields = ['image_url']

class DormSerializer(serializers.ModelSerializer):
    images      = DormImageSerializer(many=True)             
    room_types  = RoomTypeSerializer(many=True)

    class Meta:
        model  = Dorm
        fields = ["id", "zone", "name", "description",
                  "images", "room_types"]

    # ---------- create() ----------
    def create(self, validated_data):
        images_data     = validated_data.pop("images", [])
        room_types_data = validated_data.pop("room_types", [])

        dorm = Dorm.objects.create(**validated_data)

        # สร้างรูปของ dorm
        DormImage.objects.bulk_create(
            [DormImage(dorm=dorm, **img) for img in images_data]
        )

        # สร้าง room type + room images
        for rt in room_types_data:
            imgs = rt.pop("images", [])
            room_type = RoomType.objects.create(dorm=dorm, **rt)
            RoomImage.objects.bulk_create(
                [RoomImage(room_type=room_type, **img) for img in imgs]
            )
        return dorm
