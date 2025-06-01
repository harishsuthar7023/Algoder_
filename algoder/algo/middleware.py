from .models import SiteVisit
from django.utils.deprecation import MiddlewareMixin
from django.utils import timezone
import datetime

class TrackVisitorsMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.path != '/':
            return None  # Only count home page visits

        ip = self.get_client_ip(request)

        # Check if IP already logged in last 5 minutes
        recent = SiteVisit.objects.filter(
            ip_address=ip,
            timestamp__gte=timezone.now() - datetime.timedelta(minutes=5)
        )

        if not recent.exists():
            SiteVisit.objects.create(ip_address=ip)

        return None

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
