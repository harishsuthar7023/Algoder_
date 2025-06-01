from rest_framework import serializers
from .models import Product
from .models import Order

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    file = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['order_id', 'name', 'email', 'phone', 'address', 'company_name', 'status', 'amount', 'created_at', 'file']

    def get_file(self, obj):
        if obj.status == 'success' and obj.file:
            return obj.file.url
        return None
