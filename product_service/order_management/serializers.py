from rest_framework import serializers
from .models import InterestRequest
from product_management.models import Dorm  # สำหรับดึงชื่อ dorm

class InterestRequestSerializer(serializers.ModelSerializer):
    dorm_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = InterestRequest
        fields = '__all__'

    def get_dorm_name(self, obj):
        try:
            dorm = Dorm.objects.get(id=obj.dorm_id)
            return dorm.name
        except Dorm.DoesNotExist:
            return None

    def validate(self, data):
        required_fields = ['username', 'email', 'tel', 'address', 'zone', 'dorm_id']
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError({field: "This field is required."})
        return data
