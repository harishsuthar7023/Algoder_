from rest_framework import serializers
from .models import Product
from .models import Order
from .models import Topic, Video
from .models import Course

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    file = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['order_id', 'name', 'types','email', 'phone', 'address', 'company_name', 'status', 'amount', 'created_at', 'file']

    def get_file(self, obj):
        if obj.status == 'success' and obj.file:
            return obj.file.url
        return None



class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['title', 'video_url', 'documentation']

class TopicSerializer(serializers.ModelSerializer):
    videos = VideoSerializer(many=True)

    class Meta:
        model = Topic
        fields = ['name', 'videos']


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'