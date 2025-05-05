from django.shortcuts import render
from rest_framework.parsers import JSONParser
from product_management.models import Dorm
from product_management.serializers import DormSerializer
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view, parser_classes


#ของฟังก์ชัน get
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.shortcuts import get_object_or_404


@api_view(["POST"])
@parser_classes([JSONParser])
def register(request):
    serializer = DormSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


class DormView(APIView):
    #permission_classes = [AllowAny]  
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        dorms = Dorm.objects.all()
        serializer = DormSerializer(dorms, many=True)
        return Response({"data": serializer.data})
    
class DormDetailView(APIView):
    """ แก้ไข (PATCH/PUT) หรือดู (GET) ข้อมูลหอพักรายตัว  """
    permission_classes = [IsAuthenticated]          # ต้องมี JWT

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
        dorm = self.get_object(pk)
        serializer = DormSerializer(dorm, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)        # 200 OK
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # ---------- FULL UPDATE ----------
    def put(self, request, pk, format=None):
        dorm = self.get_object(pk)
        serializer = DormSerializer(dorm, data=request.data)      # ต้องส่งทุก field
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # ---------- DELETE ----------
    def delete(self, request, pk, format=None):
        dorm = self.get_object(pk)
        dorm.delete()
        return Response(
            {"detail": f"--Remove dorm id:{pk} complete--"},     # body ที่อยากให้ส่งกลับ
            status=status.HTTP_200_OK               # ใช้ 200 (หรือ 202) ก็ได้
        )
