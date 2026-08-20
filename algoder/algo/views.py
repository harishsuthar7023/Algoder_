from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import viewsets
import json
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import uuid
from django.conf import settings
from rest_framework.permissions import AllowAny
from django.utils import timezone
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from rest_framework.throttling import AnonRateThrottle
from django.core.cache import cache
from .serializers import CourseSerializer,CourseDetailSerializer,VideoSerializer,SiteContentSerializer,TopicSerializer,ProductSerializer,OrderSerializer
import firebase_admin
from firebase_admin import credentials, db
import datetime as dt
from datetime import datetime 
from datetime import timezone as tz 
from dateutil import parser
import logging
from django.db.models import Q, Count
from .models import Product, Order, Getfile, ProductImage, ProductDetail, ProductDescription,SiteContent,Topic, Video,Course

logger = logging.getLogger(__name__)


app_id = settings.CASHFREE_APP_ID
secret_key = settings.CASHFREE_SECRET_KEY
mode = settings.MODE

acckey = settings.FIREBASE_KEY_DICT
firebase_url = settings.FIREBASE_URL

# print(f"Firebase Key: {acckey}")  # Debug print to check the key

cred = credentials.Certificate(acckey)

try:
    firebase_admin.get_app()
except ValueError:
    firebase_admin.initialize_app(cred, {
        "databaseURL": firebase_url
    })

ref = db.reference("/") 

# product = Getfile.objects.get(id=2)
# print(product.file.url)


class LoginRateThrottle(AnonRateThrottle):
    scope = 'login'


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([LoginRateThrottle])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    # print(f"user auth {password}{username} {email}")

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
@permission_classes([AllowAny])
@throttle_classes([LoginRateThrottle])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    # print(f"{request}")

    user = authenticate(username=username, password=password)
    # print(f"User authenticated: {user}")

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
    # parser_classes hataye - ab JSON aa raha hai, multipart nahi

    def post(self, request):
        if not request.user.is_superuser:
            return Response({'error': 'Unauthorized'}, status=403)
        data = request.data
        # print(data)
        product = Product.objects.create(
            name=data.get('name'),
            description=data.get('description', ''),
            price=data.get('price'),
            original_price=data.get('original_price') or None,
            discount=data.get('discount') or None,
            types=data.get('types', ''),
            homepage=data.get('homepage') in ['true', 'True', True],
            video_url_1=data.get('video_url_1') or None,   # 👈 naya
            video_url_2=data.get('video_url_2') or None,   # 👈 naya
        )

        # ---- Images (ab sirf URLs list hai, koi upload nahi karna) ----
        images = data.get('images', [])
        for idx, url in enumerate(images):
            ProductImage.objects.create(product=product, image_url=url, order=idx)

        # ---- Details ----
        details = data.get('details', [])
        for idx, text in enumerate(details):
            ProductDetail.objects.create(product=product, text=text, order=idx)

        # ---- Descriptions ----
        descriptions = data.get('descriptions', [])
        for idx, desc in enumerate(descriptions):
            ProductDescription.objects.create(
                product=product,
                heading=desc.get('heading', ''),
                content=desc.get('content', ''),
                order=idx
            )

        # ---- Product file (Google Drive link) ----
        file_link = data.get('file_url')
        if file_link:
            Getfile.objects.create(name=product.name, file_url=file_link)

        serializer = ProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True).prefetch_related(
        'images', 'details', 'descriptions'
    )
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.request.method in ['GET', 'HEAD', 'OPTIONS']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def update(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return Response({"error": "Unauthorized"}, status=403)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return Response({"error": "Unauthorized"}, status=403)
        return super().destroy(request, *args, **kwargs)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_product(request, product_id):
    if not request.user.is_superuser:
        return Response({'error': 'Unauthorized'}, status=403)
    try:
        product = Product.objects.get(id=product_id)
        name = product.name
        product.delete()
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
    if str(data.get('type')) == "course":
        typess = "course"
    else:
        typess = "product"

    order = Order.objects.create(
        user=user,
        file_url=file_instance.file_url if file_instance else None,
        video_url = data.get('video_link2'),
        types = typess,  # Save the file instance
        order_id=order_id,
        product_name=data.get('product_name'),
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
    if mode == "Test":
        response = requests.post("https://sandbox.cashfree.com/pg/orders", json=payload, headers=headers, timeout=10)
    else:
        response = requests.post("https://api.cashfree.com/pg/orders", json=payload, headers=headers, timeout=10)
    data = response.json()

    if response.status_code in [200, 201]:
        data = response.json()
        return JsonResponse({
            "payment_session_id": data.get("payment_session_id"),
            "order_id": order_id
        })

    return JsonResponse({"error": response.json()}, status=400)


def add_order(product_name, order_id,name,email,phone, payment_status):
    expiry_date = dt.datetime.now() + dt.timedelta(days=300)
    expiry_ts = int(expiry_date.timestamp())  # unix timestamp

    ref = db.reference("tradingTool")

    # product_name ke andar naya order insert/update
    ref.child(product_name).update({
        order_id: {
            "expiry": expiry_ts,
            "name": name,
            "email": email,
            "phone": phone,
            "kiteuserid": "algoder6666",
            "payment_status": payment_status,
        }
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_order_status(request):
    try:
        data = request.data
        order_id = data.get("order_id")

        # order sirf DB se, sirf usi user ka jo login hai — kisi aur ka order query/update nahi ho sakta
        order = Order.objects.filter(order_id=order_id, user=request.user).first()
        if not order:
            return Response({"error": "Order not found"}, status=404)

        if mode == "Test":
            url = "https://test.cashfree.com/api/v1/order/info/status"  # For sandbox/testing
        else:
            url = "https://api.cashfree.com/api/v1/order/info/status"  # For production
        payload = {
            "appId": app_id,
            "secretKey": secret_key,
            "orderId": order_id
        }

        response = requests.post(url, data=payload, timeout=10)
        response_json = response.json()
        payment_status = response_json.get("orderStatus")
        paid_amount = float(response_json.get("orderAmount") or 0)

        # DB me saved amount se compare karo, client se aaya kuch bhi use nahi karna
        expected_amount = float(order.amount)

        if payment_status == "PAID" and paid_amount == expected_amount and order.status != "success":
            order.status = "success"
            order.save()
            payment_kind = "FREE" if int(paid_amount) == 1 else "PAID"
            add_order(order.product_name, order.order_id, order.name, order.email, order.phone, payment_kind)

        return Response({
            "order_id": order.order_id,
            "status": order.status,
            "payment_status": payment_status,
            "paid_amount": paid_amount,
        })

    except Exception as e:
        logger.warning(f"verify_order_status error: {e}")
        return Response({"error": "Could not verify order"}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_orders(request):
    user = request.user
    orders = Order.objects.filter(user=user).select_related('user').order_by('-created_at')
    course_map = dict(Course.objects.values_list('title', 'id'))
    serializer = OrderSerializer(orders, many=True, context={'course_map': course_map})
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


@api_view(["GET"])
def dashboard_stats(request):
    if not request.user.is_authenticated or not request.user.is_superuser:
        return Response({"error": "Unauthorized"}, status=403)

    try:
        total_users = User.objects.count()

        # Sirf recent 25 orders bhejo, poori table nahi — dashboard summary hai, full list nahi.
        # Poori list ke liye list_all_orders_admin (already paginated) use hota hai.
        success_orders_qs = Order.objects.filter(status="success").select_related('user').order_by('-created_at')
        pending_orders_qs = Order.objects.filter(status="pending").select_related('user').order_by('-created_at')

        success_count = success_orders_qs.count()
        pending_count = pending_orders_qs.count()

        success_orders = success_orders_qs[:25]
        pending_orders = pending_orders_qs[:25]

        recent_users = User.objects.order_by('-date_joined')[:5]

        def serialize_order(order):
            return {
                "order_id": order.order_id,
                "product_name": order.product_name,
                "types": order.types,
                "name": order.name,
                "email": order.email,
                "phone": order.phone,
                "address": order.address,
                "company_name": order.company_name or "",
                "file": order.file_url or "",
                "amount": float(order.amount) if order.amount is not None else 0,
                "status": order.status,
                "created_at": order.created_at,
                "buyer": {
                    "id": order.user.id,
                    "username": order.user.username,
                    "account_email": order.user.email,
                    "is_active": order.user.is_active,
                    "date_joined": order.user.date_joined,
                } if order.user else None,
            }

        return Response({
            "user_count": total_users,
            "success_order_count": success_count,
            "pending_order_count": pending_count,
            "success_orders": [serialize_order(o) for o in success_orders],
            "pending_orders": [serialize_order(o) for o in pending_orders],
            "recent_users": [
                {"id": u.id, "username": u.username, "email": u.email, "date_joined": u.date_joined}
                for u in recent_users
            ],
        })

    except Exception as e:
        logger.exception("dashboard_stats failed")
        return Response({"error": str(e)}, status=500)


class CourseListAPIView(generics.ListAPIView):
    """Sabhi active courses list karo - homepage/courses page ke liye"""
    queryset = Course.objects.filter(is_active=True)
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]


class CourseDetailView(generics.RetrieveAPIView):
    """Ek course ki basic info (price, description) - purchase se pehle bhi dikhegi"""
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]


class CourseContentAPIView(APIView):
    """Course ka content (topics+videos) - sirf purchase karne walo ko"""
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=404)

        has_valid_order = Order.objects.filter(
            user=request.user, status="success", types="course", product_name=course.title
        ).exists()

        if not has_valid_order:
            return Response({
                "success": False,
                "message": "You do not have an active purchase for this course.",
            }, status=200)

        serializer = CourseDetailSerializer(course)
        return Response({"success": True, "data": serializer.data})


class CourseAdminViewSet(viewsets.ModelViewSet):
    """Course ka pura CRUD - sirf admin/superuser ke liye"""
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return Response({"error": "Unauthorized"}, status=403)
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return Response({"error": "Unauthorized"}, status=403)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return Response({"error": "Unauthorized"}, status=403)
        return super().destroy(request, *args, **kwargs)


class TopicCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if not request.user.is_superuser:
            return Response({"error": "Unauthorized"}, status=403)

        course_id = request.data.get('course')
        name = request.data.get('name')
        order = request.data.get('order', 0)

        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=404)

        topic = Topic.objects.create(course=course, name=name, order=order)
        return Response(TopicSerializer(topic).data, status=201)


class TopicUpdateDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, topic_id):
        if not request.user.is_superuser:
            return Response({"error": "Unauthorized"}, status=403)
        try:
            topic = Topic.objects.get(id=topic_id)
        except Topic.DoesNotExist:
            return Response({"error": "Topic not found"}, status=404)

        topic.name = request.data.get('name', topic.name)
        topic.order = request.data.get('order', topic.order)
        topic.save()
        return Response(TopicSerializer(topic).data)

    def delete(self, request, topic_id):
        if not request.user.is_superuser:
            return Response({"error": "Unauthorized"}, status=403)
        Topic.objects.filter(id=topic_id).delete()
        return Response({"message": "Topic deleted"}, status=200)


class VideoCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if not request.user.is_superuser:
            return Response({"error": "Unauthorized"}, status=403)

        topic_id = request.data.get('topic')
        try:
            topic = Topic.objects.get(id=topic_id)
        except Topic.DoesNotExist:
            return Response({"error": "Topic not found"}, status=404)

        video = Video.objects.create(
            topic=topic,
            title=request.data.get('title'),
            video_url=request.data.get('video_url'),
            documentation=request.data.get('documentation', {}),
            order=request.data.get('order', 0),
        )
        return Response(VideoSerializer(video).data, status=201)


class VideoUpdateDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, video_id):
        if not request.user.is_superuser:
            return Response({"error": "Unauthorized"}, status=403)
        try:
            video = Video.objects.get(id=video_id)
        except Video.DoesNotExist:
            return Response({"error": "Video not found"}, status=404)

        video.title = request.data.get('title', video.title)
        video.video_url = request.data.get('video_url', video.video_url)
        video.documentation = request.data.get('documentation', video.documentation)
        video.order = request.data.get('order', video.order)
        video.save()
        return Response(VideoSerializer(video).data)

    def delete(self, request, video_id):
        if not request.user.is_superuser:
            return Response({"error": "Unauthorized"}, status=403)
        Video.objects.filter(id=video_id).delete()
        return Response({"message": "Video deleted"}, status=200)


class SiteContentPublicView(APIView):
    """Sabhi sections ek saath - homepage/pages load karne ke liye, koi login nahi chahiye"""
    permission_classes = [AllowAny]

    def get(self, request):
        data = cache.get('site_content_public')
        if data is None:
            contents = SiteContent.objects.all()
            data = {c.section: c.data for c in contents}
            cache.set('site_content_public', data, 300)  # 5 min cache
        return Response(data)


class SiteContentAdminViewSet(viewsets.ModelViewSet):
    """Full CRUD - sirf superuser"""
    queryset = SiteContent.objects.all()
    serializer_class = SiteContentSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return Response({"error": "Unauthorized"}, status=403)
        response = super().create(request, *args, **kwargs)
        cache.delete('site_content_public')
        return response

    def update(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return Response({"error": "Unauthorized"}, status=403)
        response = super().update(request, *args, **kwargs)
        cache.delete('site_content_public')
        return response

    def destroy(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return Response({"error": "Unauthorized"}, status=403)
        response = super().destroy(request, *args, **kwargs)
        cache.delete('site_content_public')
        return response

    def list(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return Response({"error": "Unauthorized"}, status=403)
        return super().list(request, *args, **kwargs)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_users(request):
    if not request.user.is_superuser:
        return Response({"error": "Unauthorized"}, status=403)

    search = request.GET.get('search', '').strip()
    sort_by = request.GET.get('sort_by', 'date')
    sort_order = request.GET.get('sort_order', 'desc')

    users = User.objects.annotate(order_count=Count('orders'))
    if search:
        users = users.filter(Q(username__icontains=search) | Q(email__icontains=search))

    sort_field_map = {'date': 'date_joined', 'name': 'username'}
    field = sort_field_map.get(sort_by, 'date_joined')
    if sort_order == 'desc':
        field = f'-{field}'
    users = users.order_by(field)

    paginator = PageNumberPagination()
    paginator.page_size = 20
    page = paginator.paginate_queryset(users, request)

    data = [{
        "id": u.id,
        "username": u.username,
        "email": u.email,
        "is_superuser": u.is_superuser,
        "is_active": u.is_active,
        "date_joined": u.date_joined,
        "last_login": u.last_login,
        "order_count": u.order_count,   # 👈 ab ek hi query me aa gaya, N+1 nahi
    } for u in page]
    return paginator.get_paginated_response(data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_user_admin(request):
    if not request.user.is_superuser:
        return Response({"error": "Unauthorized"}, status=403)

    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    make_superuser = request.data.get('is_superuser', False)

    if not username or not password:
        return Response({"error": "Username and password required"}, status=400)
    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)

    user = User.objects.create_user(username=username, email=email, password=password)
    if make_superuser:
        user.is_superuser = True
        user.is_staff = True
        user.save()

    return Response({"message": "User created", "id": user.id}, status=201)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def toggle_superuser(request, user_id):
    if not request.user.is_superuser:
        return Response({"error": "Unauthorized"}, status=403)
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    if user.id == request.user.id:
        return Response({"error": "Aap khud ka superuser status change nahi kar sakte"}, status=400)

    user.is_superuser = not user.is_superuser
    user.is_staff = user.is_superuser
    user.save()
    return Response({"id": user.id, "is_superuser": user.is_superuser})


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, user_id):
    if not request.user.is_superuser:
        return Response({"error": "Unauthorized"}, status=403)
    if user_id == request.user.id:
        return Response({"error": "Aap khud ko delete nahi kar sakte"}, status=400)
    deleted, _ = User.objects.filter(id=user_id).delete()
    if deleted:
        return Response({"message": "User deleted"})
    return Response({"error": "User not found"}, status=404)


# ---------- ORDER MANAGEMENT (search + delete) ----------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_all_orders_admin(request):
    if not request.user.is_superuser:
        return Response({"error": "Unauthorized"}, status=403)

    search = request.GET.get('search', '').strip()
    status_filter = request.GET.get('status', '').strip()
    sort_by = request.GET.get('sort_by', 'date')       # 'date' | 'name'
    sort_order = request.GET.get('sort_order', 'desc')  # 'asc' | 'desc'

    orders = Order.objects.select_related('user').all()
    if search:
        orders = orders.filter(
            Q(order_id__icontains=search) | Q(email__icontains=search) |
            Q(name__icontains=search) | Q(product_name__icontains=search) |
            Q(phone__icontains=search)
        )
    if status_filter:
        orders = orders.filter(status=status_filter)

    sort_field_map = {'date': 'created_at', 'name': 'name'}
    field = sort_field_map.get(sort_by, 'created_at')
    if sort_order == 'desc':
        field = f'-{field}'
    orders = orders.order_by(field)

    paginator = PageNumberPagination()
    paginator.page_size = 20
    page = paginator.paginate_queryset(orders, request)

    course_map = dict(Course.objects.values_list('title', 'id'))
    serializer = OrderSerializer(page, many=True, context={'course_map': course_map})
    return paginator.get_paginated_response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_order(request, order_id):
    if not request.user.is_superuser:
        return Response({"error": "Unauthorized"}, status=403)
    deleted, _ = Order.objects.filter(order_id=order_id).delete()
    if deleted:
        return Response({"message": "Order deleted"})
    return Response({"error": "Order not found"}, status=404)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_orders(request, user_id):
    if not request.user.is_superuser:
        return Response({"error": "Unauthorized"}, status=403)
    orders = Order.objects.filter(user_id=user_id).select_related('user').order_by('-created_at')
    course_map = dict(Course.objects.values_list('title', 'id'))
    serializer = OrderSerializer(orders, many=True, context={'course_map': course_map})
    return Response(serializer.data)