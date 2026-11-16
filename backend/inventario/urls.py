from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import  CategoriaViewSet, ProductosViewSet, AccionesViewSet

router = DefaultRouter()

router.register("registro_productos", ProductosViewSet, basename ="Productos")
router.register("registro_categorias", CategoriaViewSet, basename ="Categoria")
router.register("registro_Acciones", AccionesViewSet, basename ="Acciones")

urlpatterns = [path("", include(router.urls)),]

