from .views import register_user, login_user ,protected_view,create_cashfree_order, list_orders, verify_order_status,CreateProductView,UserProfileView,delete_product,dashboard_stats,track_visit
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet
# from .views import receive_trade_data
# from .views import delete_trade_symbol,place_order,trigger_start_algo,trigger_stop_algo
# from authapp.algo.main import trigger_algo
# from .views import symbol_list

router = DefaultRouter()
router.register(r'products', ProductViewSet)


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
    path('track-visit/', track_visit, name='track-visit'),
     # Optional route to test token
    # path('symbols/', symbol_list),
]
