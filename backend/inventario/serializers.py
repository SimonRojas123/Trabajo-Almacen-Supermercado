from rest_framework import serializers
from .models import Categoria, Productos, Acciones


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'descripcion']
        read_only_fields = ['id'] # Solo queremos usar la ID no queremos modificarla

class ProductosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Productos
        fields = ['id', 'categoria', 'nombre', 'codigo', 'precio', 'stock', 'descripcion']
        read_only_fields = ['id', 'stock'] # evitamos que se modifique stock de forma directa ya que queremos que se registren los cambios en la db, osea usar solo acciones

class AccionesSerializer(serializers.ModelSerializer):

    nombre_usuario = serializers.CharField(source='usuario.username', read_only=True)

    class Meta:
        model = Acciones
        fields = ['id', 'producto', 'usuario', 'nombre_usuario', 'tipo', 'cantidad', 'fecha', 'descripcion']
        read_only_fields = ['id', 'usuario', 'fecha'] # Usuario por la misma razon, queremos que el usuario se registre en movimientos