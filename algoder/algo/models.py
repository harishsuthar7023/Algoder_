# models.py

from django.db import models
from django.contrib.auth.models import User

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    original_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    discount = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    detail_1 = models.TextField(blank=True, null=True)
    detail_2 = models.TextField(blank=True, null=True)
    detail_3 = models.TextField(blank=True, null=True)
    detail_4 = models.TextField(blank=True, null=True)
    detail_5 = models.TextField(blank=True, null=True)
    full_description1 = models.TextField(blank=True, null=True)
    full_description2 = models.TextField(blank=True, null=True)

    image1 = models.ImageField(upload_to='product_images/', blank=True, null=True)
    image2 = models.ImageField(upload_to='product_images/', blank=True, null=True)
    image3 = models.ImageField(upload_to='product_images/', blank=True, null=True)
    image4 = models.ImageField(upload_to='product_images/', blank=True, null=True)
    image5 = models.ImageField(upload_to='product_images/', blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    homepage = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Getfile(models.Model):
    name = models.CharField(max_length=500)
    file = models.FileField(upload_to='products/')

    

class Order(models.Model):
    ORDER_STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('success', 'Success'),
        ('failed', 'Failed'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders", null=True)
    file = models.FileField(upload_to='products/', default=None, null=True, blank=True)  # 👈 Add this line

    order_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    address = models.TextField()
    company_name = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=10, choices=ORDER_STATUS_CHOICES, default='pending')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)



class SiteVisit(models.Model):
    ip_address = models.GenericIPAddressField()
    timestamp = models.DateTimeField(auto_now_add=True)
