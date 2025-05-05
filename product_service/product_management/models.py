from django.db import models
class Dorm(models.Model): #model ของหอ
    ZONE_CHOICES = [
        ('A', 'โซนเจปาร์ค'),
        ('B', 'โซนเชียงราก 1'),
        ('C', 'โซนเชียงราก 2'),
        ('D', 'โซนดีเคฟ'),
        ('E', 'โซนดีคอนโด'),
        ('F', 'โซนซันต้า'),
        ('G', 'โซนทียูโดม'),
        ('H', 'โซนกอล์ฟวิว'),
    ]
    zone = models.CharField(max_length=1, choices=ZONE_CHOICES)
    name = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    

class RoomType(models.Model):
    dorm = models.ForeignKey(Dorm, related_name='room_types', on_delete=models.CASCADE)
    type_name = models.CharField(max_length=100)  # type room
    price_per_month = models.DecimalField(max_digits=8, decimal_places=2)
    size_sqm = models.IntegerField(blank=True, null=True)  # ขนาดห้อง (ตร.ม.)
    is_available = models.BooleanField(default=True)  # มีห้องว่างไหม
    description = models.TextField(blank=True)

class RoomImage(models.Model):
    room_type = models.ForeignKey('RoomType', related_name='images', on_delete=models.CASCADE)
    image_url = models.URLField() 

class DormImage(models.Model):
    dorm       = models.ForeignKey(
        Dorm, related_name="images", on_delete=models.CASCADE
    )
    image_url  = models.URLField(blank=True, null=True)