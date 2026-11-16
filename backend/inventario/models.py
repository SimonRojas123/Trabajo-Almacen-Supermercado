from django.db import models
from django.core.validators import MinValueValidator
from django.conf import settings

class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True) # blanck= nos permite establecer si permitimos que el campo pueda quedar vacio o no
 
    def __str__(self):
        return self.nombre


class Productos(models.Model):

    categoria = models.ForeignKey(Categoria, on_delete=models.PROTECT, related_name='productos', null=True, blank=True) # models.PROTECT evita que se elimine por categoria (en este caso)
    codigo = models.CharField(max_length=50, unique=True)                                                               # Agregamos null= True de forma temportal mientras creamos la base de datos
    nombre = models.CharField(max_length = 50)
    precio = models.DecimalField(max_digits=20, decimal_places=2, validators=[MinValueValidator(0)]) # MinValueValidator nos permite darle un valor minimo a un dato (en este caso 0 por ser un precio)
    stock = models.PositiveIntegerField(default=0)
    descripcion = models.TextField(blank=True) # blanck= nos permite establecer si permitimos que el campo pueda quedar vacio o no

    def __str__(self):

        return self.nombre

class Acciones(models.Model):
    TIPOS = [
        ('ingresar', 'Ingresar'),
        ('retirar', 'Retirar'),
    ]

    producto = models.ForeignKey(
        Productos,
        on_delete=models.PROTECT,
        related_name='acciones'
    )

    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='acciones'
    )

    tipo = models.CharField(max_length=10, choices=TIPOS)
    cantidad = models.PositiveIntegerField( validators=[MinValueValidator(1)] ) # Valor minimo 1 ya que si se registra una accion debe ser que minimo se haya realizado 1
    fecha = models.DateTimeField(auto_now_add=True) # Fecha obtenida directamente al momento de realizar la accion (por su dispositivo)
    descripcion = models.CharField( max_length=255, blank=True )

    def __str__(self):
        return f'{self.tipo} - {self.producto.nombre}' # El como se mostrara al momento de imprimirse por pantalla
