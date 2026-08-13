# models.py

from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import JSONField  # if using PostgreSQL

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)   # 👈 wapas add kiya
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    discount = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    types = models.CharField(max_length=100, blank=True)

    video_url_1 = models.URLField(blank=True, null=True)   # 👈 naya
    video_url_2 = models.URLField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True,db_index=True)
    homepage = models.BooleanField(default=False,db_index=True)

    def __str__(self):
        return self.name

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image_url = models.URLField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

class ProductDetail(models.Model):
    """Bullet-point details — jitni chahiye utni add ho sakti hain"""
    product = models.ForeignKey(Product, related_name='details', on_delete=models.CASCADE)
    text = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']


class ProductDescription(models.Model):
    """Long description sections — jitne chahiye utne add ho sakte hain"""
    product = models.ForeignKey(Product, related_name='descriptions', on_delete=models.CASCADE)
    heading = models.CharField(max_length=255, blank=True)
    content = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

class Getfile(models.Model):
    name = models.CharField(max_length=500)
    file_url = models.URLField()   # 👈 FileField hataya, ab Cloudinary URL

    

class Order(models.Model):
    ORDER_STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('success', 'Success'),
        ('failed', 'Failed'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders", null=True)
    file_url = models.URLField(null=True, blank=True)
    video_url = models.URLField(blank=True, null=True)    # 👈 FileField hataya
    types = models.TextField(blank=True)
    product_name = models.CharField(max_length=100, default='')
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


class Course(models.Model):
    title = models.CharField(max_length=255)
    subtitle = models.TextField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    original_price = models.DecimalField(max_digits=8, decimal_places=2)
    discount_percent = models.PositiveIntegerField()
    types = models.CharField(max_length=100, default="course")

    video_url = models.URLField(help_text="Course intro video (YouTube embed URL)", blank=True)
    thumbnail_url = models.URLField(blank=True, null=True)   # 👈 ImageField hataya, Cloudinary URL

    features = models.TextField(help_text="Bullet points separated by newline")
    learning_objectives = models.TextField(help_text="What you'll learn")
    requirements = models.TextField(help_text="Prerequisites")
    target_audience = models.TextField(help_text="Who this course is for")
    full_description = models.TextField()

    instructor_name = models.CharField(max_length=100)
    instructor_bio = models.TextField()
    instructor_image_url = models.URLField(blank=True, null=True)   # 👈 yahan bhi

    language = models.CharField(max_length=50, default="English")
    level = models.CharField(max_length=50, default="Beginner")
    duration = models.CharField(max_length=50, default="6 hours")
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Topic(models.Model):
    course = models.ForeignKey(Course, related_name='topics', on_delete=models.CASCADE)   # 👈 naya link
    name = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.course.title} - {self.name}"


class Video(models.Model):
    topic = models.ForeignKey(Topic, related_name='videos', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    video_url = models.URLField()   # YouTube link
    documentation = models.JSONField(default=dict, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title


class SiteContent(models.Model):
    section = models.SlugField(max_length=100, unique=True)  # e.g. "hero", "about_header"
    label = models.CharField(max_length=150, blank=True)      # human readable, admin ke liye
    data = models.JSONField(default=dict)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.label or self.section