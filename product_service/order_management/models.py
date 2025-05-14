from django.db import models
from django.db import models
from product_management.models import Dorm  

class InterestRequest(models.Model):
    username = models.CharField(max_length=150)
    email = models.EmailField()
    tel = models.CharField(max_length=20)
    address = models.TextField()
    zone = models.CharField(max_length=10)
    dorm_id = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=100, default='รอดำเนินการ')
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} - {self.dorm_id} - {self.status}"