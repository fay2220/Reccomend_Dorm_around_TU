
# order_management/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from product_management.models import Dorm
from rest_framework.permissions import IsAuthenticated
from .models import InterestRequest
from .serializers import InterestRequestSerializer


from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import InterestRequest
from .serializers import InterestRequestSerializer

class InterestRequestView(APIView):
    permission_classes = [IsAuthenticated]
    class Meta:
        model = InterestRequest
        fields = '__all__'

    def get_dorm_name(self, obj):
        return obj.dorm.name if obj.dorm else None
    def validate(self, data):
        required_fields = ['username', 'email', 'tel', 'address', 'zone', 'dorm_id']
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError({field: "This field is required."})
        return data


    def get(self, request):
        user = request.user
        if user.is_superuser:
            requests = InterestRequest.objects.all().order_by('-created_at')
        else:
            requests = InterestRequest.objects.filter(username=user.username).order_by('-created_at')

        serializer = InterestRequestSerializer(requests, many=True)
        print("คำร้องที่แสดง:", serializer.data)
        return Response(serializer.data)

    def post(self, request):
        if not request.user or not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=401)
    
        serializer = InterestRequestSerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save(user=request.user)
                return Response(serializer.data, status=201)
            except Exception as e:
                print("Save failed:", e)
                return Response({'error': str(e)}, status=500)
        return Response(serializer.errors, status=400)
    def patch(self, request, pk):  
        try:
            instance = InterestRequest.objects.get(pk=pk)
        except InterestRequest.DoesNotExist:
            return Response({"error": "ไม่พบคำร้อง"}, status=status.HTTP_404_NOT_FOUND)

        serializer = InterestRequestSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
