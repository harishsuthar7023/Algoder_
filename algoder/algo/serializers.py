from rest_framework import serializers
from .models import Product, ProductImage, ProductDetail, ProductDescription, Order,Topic,Video,Course,SiteContent

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image_url', 'order']

class ProductDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductDetail
        fields = ['id', 'text', 'order']

class ProductDescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductDescription
        fields = ['id', 'heading', 'content', 'order']


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    details = ProductDetailSerializer(many=True, read_only=True)
    descriptions = ProductDescriptionSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    file = serializers.SerializerMethodField()
    course_id = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['order_id','video_url', 'product_name', 'name', 'types', 'email', 'phone',
                  'address', 'company_name', 'status', 'amount', 'created_at', 'file', 'course_id']

    def get_file(self, obj):
        if obj.status == 'success' and obj.file_url:
            return obj.file_url
        return None

    def get_course_id(self, obj):
        if obj.types == 'course':
            course = Course.objects.filter(title=obj.product_name).first()
            return course.id if course else None
        return None

    






class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['id', 'title', 'video_url', 'documentation', 'order']


class TopicSerializer(serializers.ModelSerializer):
    videos = VideoSerializer(many=True, read_only=True)

    class Meta:
        model = Topic
        fields = ['id', 'name', 'order', 'videos']






class CourseDetailSerializer(serializers.ModelSerializer):
    """Course + uske topics/videos, jab user access ho"""
    topics = TopicSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = '__all__'



class CourseSerializer(serializers.ModelSerializer):
    topics = TopicSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = '__all__'

class SiteContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteContent
        fields = ['id', 'section', 'label', 'data', 'updated_at']