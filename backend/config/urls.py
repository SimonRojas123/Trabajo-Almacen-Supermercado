from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)

urlpatterns = [

    path('admin/', admin.site.urls),
    path('api/', include('inventario.urls')), # Vinculacion con el inventario

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # Esta es la encargada de obtener el token de acceso junto a renovar este mismo cuando expire
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # Lo que hace es obtener un nuevo token de acceso cuando en anterior expira
]
