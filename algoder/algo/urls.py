from .views import register_user, login_user ,protected_view,create_cashfree_order, list_orders, verify_order_status,CreateProductView,UserProfileView,delete_product,dashboard_stats,list_users, create_user_admin, toggle_superuser, delete_user,list_all_orders_admin, delete_order
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet
from .views import CourseDetailView,CourseContentAPIView,CourseListAPIView
from .views import (
    CourseAdminViewSet, TopicCreateView, TopicUpdateDeleteView,
    VideoCreateView, VideoUpdateDeleteView, SiteContentAdminViewSet,SiteContentPublicView,user_orders
)

# from .views import receive_trade_data
# from .views import delete_trade_symbol,place_order,trigger_start_algo,trigger_stop_algo
# from authapp.algo.main import trigger_algo
# from .views import symbol_list

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'admin/courses', CourseAdminViewSet, basename='course-admin')
router.register(r'admin/site-content', SiteContentAdminViewSet, basename='site-content-admin')


urlpatterns = [
    path('', include(router.urls)),
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('protected/', protected_view, name='protected'),
    path('create-order/', create_cashfree_order),
    path('orders/', list_orders),
    path('verify-order/', verify_order_status, name='verify_order'),
    path("create-product/", CreateProductView.as_view(), name="create-product"),
    path('user-profile/', UserProfileView.as_view(), name='user-profile'),
    path('products/<int:product_id>/delete/', delete_product, name='delete_product'),
    path('dashboard-stats/', dashboard_stats, name='dashboard-stats'),
    path('courses/', CourseListAPIView.as_view(), name='course-list'),
    path('course/<int:pk>/', CourseDetailView.as_view(), name='course-detail'),
    path('course/<int:course_id>/content/', CourseContentAPIView.as_view(), name='course-content'),
    path('topics/', TopicCreateView.as_view()),
    path('topics/<int:topic_id>/', TopicUpdateDeleteView.as_view()),
    path('videos/', VideoCreateView.as_view()),
    path('videos/<int:video_id>/', VideoUpdateDeleteView.as_view()),

    path('site-content/', SiteContentPublicView.as_view(), name='site-content-public'),


    path('admin/users/', list_users, name='list-users'),
    path('admin/users/create/', create_user_admin, name='create-user-admin'),
    path('admin/users/<int:user_id>/toggle-superuser/', toggle_superuser, name='toggle-superuser'),
    path('admin/users/<int:user_id>/delete/', delete_user, name='delete-user'),

    path('admin/orders/', list_all_orders_admin, name='list-all-orders'),
    path('admin/orders/<str:order_id>/delete/', delete_order, name='delete-order'),
    path('admin/users/<int:user_id>/orders/', user_orders, name='user-orders'),
     # Optional route to test token
    # path('symbols/', symbol_list),
]
