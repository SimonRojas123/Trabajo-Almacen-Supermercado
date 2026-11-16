from django.contrib import admin
from .models import Categoria, Productos, Acciones

admin.site.register(Categoria)
admin.site.register(Productos) #registran los modelos en el panel de administracion Django
admin.site.register(Acciones)
