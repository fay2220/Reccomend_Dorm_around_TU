from rest_framework import serializers
from .models import InterestRequest
from product_management.models import Dorm

class InterestRequestSerializer(serializers.ModelSerializer):
    dorm_name = serializers.CharField(source='dorm.name', read_only=True)

    class Meta:
        model = InterestRequest
        fields = '__all__'
        read_only_fields = ['user', 'dorm'] 

    def validate(self, data):
        required_fields = ['username', 'email', 'tel', 'address', 'zone']
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError({field: "This field is required."})
        return data

    def create(self, validated_data):
        request = self.context.get('request')
        dorm_id = self.initial_data.get('dorm_id')

        try:
            dorm = Dorm.objects.get(pk=dorm_id)
        except Dorm.DoesNotExist:
            raise serializers.ValidationError({'dorm_id': 'ไม่พบหอพักที่เลือก'})

        return InterestRequest.objects.create(
            user=request.user,
            dorm=dorm,
            **validated_data
        )
