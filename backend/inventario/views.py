from django.db import transaction
from rest_framework import viewsets
from rest_framework.exceptions import ValidationError

from .models import Acciones, Productos, Categoria
from .serializers import (CategoriaSerializer, ProductosSerializer, AccionesSerializer)


class CategoriaViewSet(viewsets.ModelViewSet):

    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


class ProductosViewSet(viewsets.ModelViewSet):

    queryset = Productos.objects.select_related('categoria').all()
    serializer_class = ProductosSerializer


class AccionesViewSet(viewsets.ModelViewSet):

    queryset = Acciones.objects.select_related('producto', 'usuario').all()

    serializer_class = AccionesSerializer


    # REGISTRAR UNA ACCION
    def perform_create(self, serializer): # Metodo propio de Django Rest, se ejecuta cuando hacemos un POST

        with transaction.atomic(): #Evita que la accion se realize en caso de que algo falle

            producto_id = serializer.validated_data['producto'].id # Obtenemos la id del producto

            producto = Productos.objects.select_for_update().get(id=producto_id)  #Buscamos el producto en la base de datos y evita que hayan 2 transacciones simultaneas del mismo producto

            tipo = serializer.validated_data['tipo']
            cantidad = serializer.validated_data['cantidad']  #Obtenemos datos y cantidad

            if tipo == 'ingresar':  # Si es ingreso, aumenta el stock
                producto.stock += cantidad

            elif tipo == 'retirar': # Si es retiro baja el stock

                if cantidad > producto.stock: #Chequeo de que no se retire mas del stock disponible
                    raise ValidationError(
                        'No hay suficiente stock para realizar el retiro.'
                    )

                producto.stock -= cantidad

            producto.save(update_fields=['stock']) # Finalmente se actualiza el stock ya modificado por el antiguo

            serializer.save(usuario=self.request.user) #Guardamos la accion y registramos el usuario que la realizo

    # EDITAR UNA ACCION
    def perform_update(self, serializer): # Lo mismo que antes pero en ves de registrar un movimiento lo cambia

        with transaction.atomic():

            accion_anterior = self.get_object() # Obtenemos el movimiento que queremos modificar

            producto_anterior_id = accion_anterior.producto_id # Obtenemos la id del movimiento

            producto_nuevo_id = serializer.validated_data.get('producto', accion_anterior.producto).id #Obtenemos el producto original y el nuevo

            ids = sorted(set([producto_anterior_id, producto_nuevo_id]))

            productos = {
                p.id: p
                for p in Productos.objects.select_for_update()
                .filter(id__in=ids).order_by('id') #----------------------------
                }


            producto_anterior = productos[producto_anterior_id]
            producto_nuevo = productos[producto_nuevo_id] 

            if accion_anterior.tipo == 'ingresar':
                producto_anterior.stock -= accion_anterior.cantidad #Revertimos los cambios hechos haciendo la operacion contraria a la hecha
            else:
                producto_anterior.stock += accion_anterior.cantidad



            # Aca ya aplicamos los nuevos datos y realizamos el nuevo movimiento
            
            tipo = serializer.validated_data.get(
                'tipo', accion_anterior.tipo
            )

            cantidad = serializer.validated_data.get(
                'cantidad', accion_anterior.cantidad
            )

            if tipo == 'ingresar':
                producto_nuevo.stock += cantidad

            elif tipo == 'retirar':

                if cantidad > producto_nuevo.stock:
                    raise ValidationError(
                        'No hay suficiente stock para realizar el retiro.'
                    )

                producto_nuevo.stock -= cantidad

            # Guardamos los cambios
            if producto_anterior.stock < 0:

                raise ValidationError('No se puede editar la acción por que el stock seria menor que 0')

            for producto in productos.values():
                producto.save(update_fields=['stock'])

            serializer.save()

    
    def perform_destroy(self, instance): # Finalmente eliminar un movimiento

        with transaction.atomic():

            producto = Productos.objects.select_for_update().get(
                id=instance.producto_id
            )

            if instance.tipo == 'ingresar':
                producto.stock -= instance.cantidad # Misma logica que el update
            else:
                producto.stock += instance.cantidad

            if producto.stock < 0:
                raise ValidationError(
                    'No se puede editar la acción por que el stock seria menor que 0'
                )

            producto.save(update_fields=['stock'])

            instance.delete()

