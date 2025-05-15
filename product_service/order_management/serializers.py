from rest_framework import serializers
from .models import InterestRequest

class InterestRequestSerializer(serializers.ModelSerializer):
    dorm_name = serializers.CharField(source='dorm.name', read_only=True)
    class Meta:
        model = InterestRequest
        fields = '__all__'

    
    def validate(self, data):
        required_fields = ['username', 'email', 'tel', 'address', 'zone', 'dorm_id']
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError({field: "This field is required."})
        return data
