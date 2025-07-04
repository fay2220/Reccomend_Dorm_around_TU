from django.shortcuts import render
from rest_framework.parsers import JSONParser
from product_management.models import Dorm,DormImage
from product_management.serializers import DormSerializer,DormImageSerializer
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view, parser_classes


#ของฟังก์ชัน get
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.shortcuts import get_object_or_404
from product_management.models import RoomType


@api_view(["POST"])
@parser_classes([JSONParser])
def register(request):
    serializer = DormSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


class DormView(APIView):
    permission_classes = [AllowAny]  
    def get(self, request, format=None):
        dorms = Dorm.objects.all()
        serializer = DormSerializer(dorms, many=True)
        return Response({"data": serializer.data})
    
class DormDetailView(APIView):
    """ แก้ไข (PATCH/PUT) หรือดู (GET) ข้อมูลหอพักรายตัว  """
             # ต้องมี JWT

    # ---------- util ----------
    def get_object(self, pk):
        """คืน Dorm หรือ 404"""
        return get_object_or_404(Dorm, pk=pk)

    # ---------- READ ----------
    def get(self, request, pk, format=None):
        dorm = self.get_object(pk)
        serializer = DormSerializer(dorm)
        return Response(serializer.data)

    # ---------- PARTIAL UPDATE ----------
    def patch(self, request, pk, format=None):
        permission_classes = [IsAuthenticated]  
        dorm = self.get_object(pk)
        serializer = DormSerializer(dorm, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)        # 200 OK
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # ---------- FULL UPDATE ----------
    def put(self, request, pk, format=None):
        permission_classes = [IsAuthenticated]  
        dorm = self.get_object(pk)
        serializer = DormSerializer(dorm, data=request.data)      # ต้องส่งทุก field
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # ---------- DELETE ----------
    def delete(self, request, pk, format=None):
        permission_classes = [IsAuthenticated]  
        dorm = self.get_object(pk)
        dorm.delete()
        return Response(
            {"detail": f"--Remove dorm id:{pk} complete--"},     # body ที่อยากให้ส่งกลับ
            status=status.HTTP_200_OK               # ใช้ 200 (หรือ 202) ก็ได้
        )
    
    images = DormImageSerializer(many=True)
    class Meta:
        model = Dorm
        fields = '__all__'
    def update(self, instance, validated_data):
        permission_classes = [IsAuthenticated]  
        images_data = validated_data.pop('images', [])

        # อัปเดต field ปกติอื่น ๆ
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # ได้ queryset รูปภาพเดิม
        old_images = list(instance.images.all())

        # วนตามลำดับ และอัปเดตเฉพาะ image_url เท่านั้น
        for old_image, new_data in zip(old_images, images_data):
            new_url = new_data.get('image_url')
            if new_url:
                old_image.image_url = new_url
                old_image.save()

        return instance


class DormByZoneView(APIView):
    def get(self, request, zone):
        dorms = Dorm.objects.filter(zone__iexact=zone)
        serializer = DormSerializer(dorms, many=True)
        return Response(serializer.data)

@api_view(['DELETE'])
def delete_room_type(request, pk):
    try:
        room_type = RoomType.objects.get(pk=pk)
        room_type.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except RoomType.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)