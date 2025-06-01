from django.shortcuts import render
from rest_framework.views import APIView
# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import viewsets
from .models import Product,Order,Getfile
from .serializers import ProductSerializer,OrderSerializer
# views.py
import json
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import uuid
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
# from cashfree_sdk.payouts import Cashfree
# views.py
from rest_framework.parsers import MultiPartParser, FormParser

app_id = settings.CASHFREE_APP_ID
secret_key = settings.CASHFREE_SECRET_KEY
# api_base = settings.CASHFREE_API_BASE

@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    print(f"user auth {password}{username} {email}")

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.create_user(username=username, email=email, password=password)
    if user is not None:
        # print(f"User authenticated: {user}")
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })

    return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    print(f"{request}")

    user = authenticate(username=username, password=password)
    print(f"User authenticated: {user}")

    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    # print(f"Protected view accessed by {request.user.username}")
    return Response({'message': f'Hello {request.user.username}, you are authenticated!'})



class CreateProductView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = ProductSerializer(data=request.data)

        if serializer.is_valid():
            product = serializer.save()

            # Save file to Getfile model
            file = request.FILES.get('file')
            if file:
                Getfile.objects.create(name=product.name, file=file)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer


@api_view(['DELETE'])
def delete_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        name = product.name

        # Delete from Product
        product.delete()

        # Delete from Getfile (with same name)
        Getfile.objects.filter(name=name).delete()

        return Response({'message': 'Product and associated file deleted.'}, status=status.HTTP_200_OK)

    except Product.DoesNotExist:
        return Response({'error': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)





@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_cashfree_order(request):
    data = json.loads(request.body)
    order_id = f"order_{uuid.uuid4().hex[:10]}"
    user = request.user
    # Save to DB
    file_instance = Getfile.objects.filter(name=data.get('product_name')).first()
    print(f"File instance retrieved: {file_instance}")
    if not file_instance:
        return JsonResponse({"error": "File not found"}, status=404)
    
    print(f"Creating order with ID: and data: {user}")
    order = Order.objects.create(
        user=user,
        file=file_instance.file,  # Save the file instance
        order_id=order_id,
        name=data.get('firstName'),
        email=data.get('email'),
        phone=data.get('phone'),
        address=data.get('address'),
        company_name=data.get('company_name', ''),
        amount=data.get('amount'),
        status="pending"
    )

    payload = {
        "order_id": order_id,
        "order_amount": float(order.amount),
        "order_currency": "INR",
        "customer_details": {
            "customer_id": f"cust_{order.phone}",
            "customer_email": order.email,
            "customer_phone": order.phone
        }
    }

    headers = {
        "Content-Type": "application/json",
        "x-api-version": "2022-09-01",
        "x-client-id": app_id,
        "x-client-secret": secret_key,
        "Accept": "application/json"
    }

    response = requests.post("https://sandbox.cashfree.com/pg/orders", json=payload, headers=headers)

    if response.status_code in [200, 201]:
        data = response.json()
        return JsonResponse({
            "payment_session_id": data.get("payment_session_id"),
            "order_id": order_id
        })

    return JsonResponse({"error": response.json()}, status=400)


# @api_view(['GET'])
# def get_file_by_name(name):
#     try:
        
#         print({
#             'name': file_instance.name,
#             'file_url': file_instance.file.url,
#         })

#         # return file_instance.file  # optional: return file if needed
#     except Getfile.DoesNotExist:
#         print(f"❌ File not found for name: {name}")
#         return None
        # return HttpResponseNotFound("File not found for this name.")

# get_file_by_name("EXCEL TOOL")

@csrf_exempt
def verify_order_status(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            order_id = data.get("order_id")
            expected_amount = float(data.get("amount"))

            url = "https://test.cashfree.com/api/v1/order/info/status"
            payload = {
                "appId": app_id,
                "secretKey": secret_key,
                "orderId": order_id
            }

            response = requests.post(url, data=payload)
            response_json = response.json()
            payment_status = response_json.get("orderStatus")
            paid_amount = float(response_json.get("orderAmount"))

            # Debug info
            print(f"Response JSON: {response_json}")

            # Fetch order from DB
            order = Order.objects.filter(order_id=order_id).first()
            if not order:
                return JsonResponse({"error": "Order not found"}, status=404)

            # Update status if paid and amount matches
            if payment_status == "PAID" and paid_amount == expected_amount:
                order.status = "success"
                order.save()

            return JsonResponse({
                "order_id": order_id,
                "status": order.status,
                "payment_status": payment_status,
                "paid_amount": paid_amount,
            })

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_orders(request):
    user = request.user
    orders = Order.objects.filter(user=user).order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)




class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "username": user.username,
            "email": user.email,
            "is_superuser": user.is_superuser,
        })



from .models import SiteVisit
from rest_framework.permissions import AllowAny
from django.utils import timezone

def get_client_ip(request):
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0]
    return request.META.get("REMOTE_ADDR")

@api_view(["GET"])
@permission_classes([AllowAny])
def track_visit(request):
    ip = get_client_ip(request)
    recent = SiteVisit.objects.filter(
        ip_address=ip,
        timestamp__gte=timezone.now() - timezone.timedelta(minutes=5)
    )
    if not recent.exists():
        SiteVisit.objects.create(ip_address=ip)
    return Response({"status": "Visitor Tracked"})

@api_view(["GET"])
def dashboard_stats(request):
    if not request.user.is_authenticated or not request.user.is_superuser:
        return Response({"error": "Unauthorized"}, status=403)

    total_views = SiteVisit.objects.count()
    total_users = User.objects.count()
    success_orders = Order.objects.filter(status="success")
    pending_orders = Order.objects.filter(status="pending")

    # Select only the required fields
    def serialize_order(order):
        return {
            "order_id": order.order_id,
            "name": order.name,
            "email": order.email,
            "phone": order.phone,
            "address": order.address,
            "file": order.file.url if order.file else "",
            "amount": float(order.amount),
        }

    return Response({
        "viewer_count": total_views,
        "user_count": total_users,
        "success_order_count": success_orders.count(),
        "success_orders": [serialize_order(order) for order in success_orders],
        "pending_orders": [serialize_order(order) for order in pending_orders],
    })

