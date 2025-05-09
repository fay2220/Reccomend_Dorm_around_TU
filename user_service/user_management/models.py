from django.db import models
from django.contrib.auth.models import User
class Customer(models.Model): #model ของ user ปกติ
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    firstname = models.CharField(max_length=255, blank=True)
    lastname = models.CharField(max_length=255, blank=True)
    address = models.CharField(max_length=500, blank=True)
    email = models.CharField(max_length=255, blank=True)
    tel = models.CharField(max_length=20, blank=True)