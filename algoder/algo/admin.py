# admin.py
from django.contrib import admin
from django_json_widget.widgets import JSONEditorWidget
from django import forms
from .models import (
    Product, ProductImage, ProductDetail, ProductDescription,
    Order, Getfile, Topic, Video,Course,SiteContent
)

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class ProductDetailInline(admin.TabularInline):
    model = ProductDetail
    extra = 1


class ProductDescriptionInline(admin.StackedInline):
    model = ProductDescription
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'is_active', 'created_at')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [ProductImageInline, ProductDetailInline, ProductDescriptionInline]

    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'types', 'price', 'is_active', 'homepage', 'original_price', 'discount')
        }),
        ('Videos', {   # 👈 naya section
            'fields': ('video_url_1', 'video_url_2')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_id', 'email', 'product_name', 'name', 'amount', 'status', 'phone', 'address', 'company_name', 'created_at', 'file_url']
    search_fields = ['email', 'order_id', 'name']
    list_filter = ['status', 'created_at']


@admin.register(Getfile)
class GetfileAdmin(admin.ModelAdmin):
    list_display = ['name', 'file_url']


class VideoAdminForm(forms.ModelForm):
    class Meta:
        model = Video
        fields = '__all__'
        widgets = {
            'documentation': JSONEditorWidget(),
        }

class VideoInline(admin.StackedInline):
    model = Video
    form = VideoAdminForm
    extra = 1


class TopicInline(admin.TabularInline):
    model = Topic
    extra = 1


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'price', 'level', 'is_active', 'created_at')
    list_filter = ('level', 'language', 'is_active')
    search_fields = ('title', 'subtitle', 'instructor_name')
    readonly_fields = ('created_at',)
    inlines = [TopicInline]
    fieldsets = (
        ('Basic Info', {
            'fields': ('title', 'subtitle', 'price', 'original_price', 'discount_percent', 'types', 'is_active')
        }),
        ('Media', {
            'fields': ('video_url', 'thumbnail_url')
        }),
        ('Course Content', {
            'fields': ('features', 'learning_objectives', 'requirements', 'target_audience', 'full_description')
        }),
        ('Instructor Info', {
            'fields': ('instructor_name', 'instructor_bio', 'instructor_image_url')
        }),
        ('Meta', {
            'fields': ('language', 'level', 'duration', 'created_at')
        }),
    )


@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ('name', 'course', 'order')
    list_filter = ('course',)
    inlines = [VideoInline]


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    form = VideoAdminForm
    list_display = ('title', 'topic', 'order')
    list_filter = ('topic',)



@admin.register(SiteContent)
class SiteContentAdmin(admin.ModelAdmin):
    list_display = ('section', 'label', 'updated_at')
    form = type('SiteContentForm', (forms.ModelForm,), {
        'Meta': type('Meta', (), {'model': SiteContent, 'fields': '__all__',
                                    'widgets': {'data': JSONEditorWidget()}})
    })