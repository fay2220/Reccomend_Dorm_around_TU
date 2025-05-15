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
        serializer = InterestRequestSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
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
