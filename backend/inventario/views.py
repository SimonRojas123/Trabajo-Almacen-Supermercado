from django.shortcuts import render
from rest_framework import viewsets
from .models import Acciones, Productos, Categoria
from rest_framework.exceptions import ValidationError # Permite lanzar un mensaje de error en caso de que una condicional no se cumpla

from .serializers import CategoriaSerializer, ProductosSerializer, AccionesSerializer


class CategoriaViewSet(viewsets.ModelViewSet):

    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class ProductosViewSet(viewsets.ModelViewSet):

    queryset = Productos.objects.select_related('categoria').all() #Tenemos que aclarar de que estamos utilizando una referencia a otra tabla
    serializer_class = ProductosSerializer

class AccionesViewSet(viewsets.ModelViewSet):

    queryset = Acciones.objects.select_related('producto', 'usuario').all()
    serializer_class = AccionesSerializer

