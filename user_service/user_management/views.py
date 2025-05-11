from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.contrib.auth.models import User
from user_management.models import Customer
from user_management.serializers import CustomerSerializer

#ของฟังก์ชัน get
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

@csrf_exempt
def register(request):
    if request.method == "POST":
        data = JSONParser().parse(request)
        try:
            new_user = User.objects.create_user(username=data['username'], password=data['password'])
        except:
            return JsonResponse({"error":"username already used."}, status=400)
        new_user.save()
        data['user'] = new_user.id
        customer_serializer = CustomerSerializer(data=data)
        if customer_serializer.is_valid():
            customer_serializer.save()
            return JsonResponse(customer_serializer.data, status=201)
        new_user.delete()
        return JsonResponse({"error":"data not valid"}, status=400)
    return JsonResponse({"error":"method not allowed."}, status=405)


#Create View class after register() view
class CustomerView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        customer_data = Customer.objects.get(user=request.user)
        customer_serializer = CustomerSerializer(customer_data)
        content = {
    '       data': customer_serializer.data
        }
        return Response(content)



class MyTokenObtainPairView(TokenObtainPairView):
    from .serializers import MyTokenObtainPairSerializer
    serializer_class = MyTokenObtainPairSerializer