from rest_framework import serializers
from product_management.models import Dorm, DormImage, RoomType, RoomImage

class RoomImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomImage
        fields = ['image_url']

class RoomTypeSerializer(serializers.ModelSerializer):
    images = RoomImageSerializer(many=True, required=False, allow_empty=True)

    class Meta:
        model = RoomType
        fields = ['type_name', 'price_per_month', 'size_sqm', 'is_available', 'description', 'images']

class DormImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DormImage
        fields = ['image_url']
        read_only_fields = ['id']

class DormSerializer(serializers.ModelSerializer):
    images = DormImageSerializer(many=True)
    room_types = RoomTypeSerializer(many=True)

    class Meta:
        model = Dorm
        fields = ["id", "zone", "name", "description", "images", "room_types", "location_embed"] 

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        room_types_data = validated_data.pop('room_types', [])
        validated_data.pop('id', None)

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
        room_types_data = validated_data.pop('room_types', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        #  อัปเดตรูปหอพัก
        instance.images.all().delete()
        for image_data in images_data:
            DormImage.objects.create(dorm=instance, **image_data)

        #  อัปเดต room types แบบตรวจสอบ id
        existing_room_types = {rt.id: rt for rt in instance.room_types.all()}
        updated_ids = []

        for rt_data in room_types_data:
            images = rt_data.pop('images', [])
            rt_id = rt_data.get("id", None)

            if rt_id and rt_id in existing_room_types:
                # แก้ไขข้อมูลเก่า
                rt = existing_room_types[rt_id]
                for attr, value in rt_data.items():
                    setattr(rt, attr, value)
                rt.save()

                #  อัปเดตรูปภาพห้อง
                rt.images.all().delete()
                for img in images:
                    RoomImage.objects.create(room_type=rt, **img)

                updated_ids.append(rt_id)

            else:
                #  เพิ่มใหม่
                new_rt = RoomType.objects.create(dorm=instance, **rt_data)
                for img in images:
                    RoomImage.objects.create(room_type=new_rt, **img)

        #  ลบ room types ที่ไม่ได้อยู่ในรายการอัปเดต
        for rt_id, rt in existing_room_types.items():
            if rt_id not in updated_ids:
                rt.delete()

        return instance
