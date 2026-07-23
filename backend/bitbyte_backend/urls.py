from django.contrib import admin
from django.urls import path, include, re_path
from django.views.static import serve
from django.conf import settings
from django.http import JsonResponse


def api_root(_request):
    return JsonResponse({
        'status': 'ok',
        'message': 'BitByte backend API is running',
        'api_base': '/api/',
        'health': '/api/ping/',
        'products': '/api/jewelry-products/',
    })

urlpatterns = [
    path('', api_root),
    path('admin/', admin.site.urls),
    path('api/', include('accounts.urls')),
    
    re_path(r'^media/(?P<path>.*)$', serve, {
        'document_root': settings.MEDIA_ROOT,
    }),
]
