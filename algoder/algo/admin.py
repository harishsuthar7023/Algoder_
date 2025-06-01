# admin.py

from django.contrib import admin
from .models import Order
from .models import Product, Getfile

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'is_active', 'created_at')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'price', 'is_active','homepage', 'original_price', 'discount')
        }),
        ("details", {
            'fields': ('detail_1', 'detail_2', 'detail_3', 'detail_4', 'detail_5','full_description1', 'full_description2')
        }),
        ('Images', {
            'fields': ('image1', 'image2', 'image3', 'image4', 'image5')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )



@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_id','email', 'name', 'amount', 'status','phone','address','company_name', 'created_at','file']
    search_fields = ['email', 'order_id', 'name']
    list_filter = ['status', 'created_at']

@admin.register(Getfile)
class OrderAdmin(admin.ModelAdmin):
    name = ['name']
    file = ['file']