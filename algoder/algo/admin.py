# admin.py
from .models import Topic, Video
from django.contrib import admin
from .models import Order
from .models import Product, Getfile
from django_json_widget.widgets import JSONEditorWidget
from django import forms

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name','price', 'is_active', 'created_at')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('name', 'description','types', 'price', 'is_active','homepage', 'original_price', 'discount')
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




class VideoAdminForm(forms.ModelForm):
    class Meta:
        model = Video
        fields = '__all__'
        widgets = {
            'documentation': JSONEditorWidget(),  # JSON editor for structured content
        }

class VideoInline(admin.TabularInline):
    model = Video
    form = VideoAdminForm
    extra = 1

class TopicAdmin(admin.ModelAdmin):
    list_display = ('name',)
    inlines = [VideoInline]

admin.site.register(Topic, TopicAdmin)
admin.site.register(Video) 



from .models import Course

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'price', 'original_price', 'discount_percent', 'level', 'created_at')
    list_filter = ('level', 'language')
    search_fields = ('title', 'subtitle', 'instructor_name')
    readonly_fields = ('created_at',)
    fieldsets = (
        ('Basic Info', {
            'fields': ('title', 'subtitle', 'price', 'original_price', 'discount_percent',"types")
        }),
        ('Media', {
            'fields': ('video_url', 'thumbnail')
        }),
        ('Course Content', {
            'fields': ('features', 'learning_objectives', 'requirements', 'target_audience', 'curriculum', 'full_description')
        }),
        ('Instructor Info', {
            'fields': ('instructor_name', 'instructor_bio', 'instructor_image')
        }),
        ('Meta', {
            'fields': ('language', 'level', 'duration', 'created_at')
        }),
    )