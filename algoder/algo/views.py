from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
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
from .serializers import CourseSerializer,CourseDetailSerializer,VideoSerializer,SiteContentSerializer,TopicSerializer,ProductSerializer,OrderSerializer
import firebase_admin
from firebase_admin import credentials, db
import datetime as dt
from datetime import datetime 
from datetime import timezone as tz 
from dateutil import parser
import logging

from .models import Product, Order, Getfile, ProductImage, ProductDetail, ProductDescription,SiteContent,Topic, Video,SiteVisit,Course

logger = logging.getLogger(__name__)


app_id = settings.CASHFREE_APP_ID
secret_key = settings.CASHFREE_SECRET_KEY

acckey = settings.FIREBASE_KEY_DICT
firebase_url = settings.FIREBASE_URL

# print(f"Firebase Key: {acckey}")  # Debug print to check the key

cred = credentials.Certificate(acckey)

firebase_admin.initialize_app(cred, {
    "databaseURL": firebase_url
})

ref = db.reference("/") 

# product = Getfile.objects.get(id=2)
# print(product.file.url)

@api_view(['POST'])
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
        data = request.data

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
    print(data)
    order_id = f"order_{uuid.uuid4().hex[:10]}"
    user = request.user
    # Save to DB
    # print(data)
    file_instance = Getfile.objects.filter(name=data.get('product_name')).first()
    # print(f"File instance retrieved: {file_instance}")
    if str(data.get('type')) == "course":
        typess = "course"
    else:
        typess = "product"
    
    # print(f"Creating order with ID: and data: {user}")
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

    # response = requests.post("https://sandbox.cashfree.com/pg/orders", json=payload, headers=headers)
    response = requests.post("https://api.cashfree.com/pg/orders", json=payload, headers=headers)
    data = response.json()
    # logger.info(response)

    if response.status_code in [200, 201]:
        data = response.json()
        # logger.info(data)
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

@csrf_exempt
def verify_order_status(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            order_id = data.get("order_id")
            product_name = data.get("product_name")
            total_order = data.get("total_order")
            # print(f"total order {total_order}")
            try:
                now = datetime.now(tz.utc)

                closest_order = min(
                    total_order,
                    key=lambda o: abs(parser.parse(o["created_at"]) - now)
                )

                # print(f"Closest order: {closest_order}")
            except Exception as e:
                logger.info(f"Error finding closest order: {e}")


            expected_amount = float(data.get("amount"))

            url = "https://api.cashfree.com/api/v1/order/info/status" # For production
            # url = "https://test.cashfree.com/api/v1/order/info/status" # For sandbox/testing
            payload = {
                "appId": app_id,
                "secretKey": secret_key,
                "orderId": order_id
            }

            response = requests.post(url, data=payload)
            response_json = response.json()
            # print(data)
            payment_status = response_json.get("orderStatus")
            paid_amount = float(response_json.get("orderAmount"))

            # Debug info
            # print(f"Response JSON: {response_json}")

            # Fetch order from DB
            order = Order.objects.filter(order_id=order_id).first()
            if not order:
                return JsonResponse({"error": "Order not found"}, status=404)

            # Update status if paid and amount matches
            if payment_status == "PAID" and paid_amount == expected_amount:
                order.status = "success"
                order.save()
                if int(paid_amount) == 1 and order_id == closest_order["order_id"]:
                    add_order(product_name, order_id,closest_order['name'],closest_order['email'],closest_order['phone'],"FREE")
                elif order_id == closest_order["order_id"]:
                    add_order(product_name, order_id,closest_order['name'],closest_order['email'],closest_order['phone'],"PAID")

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

    try:
        total_views = SiteVisit.objects.count()
        total_users = User.objects.count()

        success_orders = Order.objects.filter(status="success")
        pending_orders = Order.objects.filter(status="pending")

        def serialize_order(order):
            return {
                "order_id": order.order_id,
                "name": order.name,
                "email": order.email,
                "phone": order.phone,
                "address": order.address,
                "file": order.file_url or "",
                "amount": float(order.amount) if order.amount is not None else 0,
            }

        return Response({
            "viewer_count": total_views,
            "user_count": total_users,
            "success_order_count": success_orders.count(),
            "success_orders": [serialize_order(o) for o in success_orders],
            "pending_orders": [serialize_order(o) for o in pending_orders],
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
    # print("yes heree..........................")
    def get(self, request):
        # print("GET /site-content/ called")
        contents = SiteContent.objects.all()
        # print(contents)
        data = {c.section: c.data for c in contents}
        return Response(data)


class SiteContentAdminViewSet(viewsets.ModelViewSet):
    """Full CRUD - sirf superuser"""
    queryset = SiteContent.objects.all()
    serializer_class = SiteContentSerializer
    permission_classes = [IsAuthenticated]

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

    def list(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return Response({"error": "Unauthorized"}, status=403)
        return super().list(request, *args, **kwargs)