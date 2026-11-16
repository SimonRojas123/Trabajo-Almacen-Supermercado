# Trabajo supermercado
> Esta diseñado para trabajadores de un supermercado que quieran registrar productos, hacer movimientos y ver su historiall de modificaciones.

## 1. Descripción del proyecto
- **Problematica:**  Un supermercado necesita una aplicación la cual permita registrar productos y hacer movimientos (como retirar o ingresar esos productos) para identificar las transacciones.
- **Usuarios objetivo:** Trabajadores encargados de administrar el inventario interno del supermercado (como genentes de reponedores).
- **Funcionalidades previstas:** Operaciones CRUD en backend junto a referencia del frontend **funcionalidades ya implementadas:** Operaciones CRUD totalmente implementadas, junto a la totalidad del dashboard y asociados junto a logeo usando JWT.
## 2. Equipo
| Integrante | Rol | Usuario GitHub |
|------------|-----|----------------|
| Simon Rojas | backend y frontend | SimonRojas123 |
## 3. Stack y versiones
| Tecnología | Versión |
|------------|---------|
| Python | (Python 3.14.7 --version) |
| Django | (Django 6.1.3 --version) |
| Node.js / npm | (v24.19.0 / 11.17.0) |
| React / Vite | (react-dom@19.3.1 / vite/8.3.7 win32-x64 node-v24.19.0 ) |
| Base de datos | SQLite |
## 4. Arquitectura
Se recibe la peticion mediante el react, luego la api client se encarga de los direccionamientos comunicandose con django, este mismo mediante vistas y serializers comprueba y transforma los datos y finalmente se registran en la base de datos de liteSQL guardada en el backend
Utilice axios para hacerlo por su sistema de consumo de apis con operaciones CRUD.
## 5. Estructura del repositorio
**Estructura backend**
backend/
├── config/
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
├── entorno/
│
├── inventario/
│   ├── __pycache__/
│   ├── migrations/
│   │
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── serializers.py
│   ├── tests.py
│   ├── urls.py
│   └── views.py
│
├── db.sqlite3
├── manage.py
└── requirements.txt

**Estructura frontend**
frontend/
├── src/
│   ├── api/
│   │   └── client.js          
│   │
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ProductosList.jsx 
│   │   ├── ProductosForm.jsx
│   │   ├── CategoriasList.jsx
│   │   ├── MovimientosList.jsx
│   │   └── HistorialList.jsx
│   │
│   ├── App.jsx
│   └── App.css
│
├── .env
├── package.json
└── vite.config.js


## 6. Lo implementado hasta ahora 
### Modelo de datos
**Categoria**
class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True) # blanck= nos permite establecer si permitimos que el campo pueda quedar vacio o no
 
    def __str__(self):
        return self.nombre

**Productos**
class Productos(models.Model):

    categoria = models.ForeignKey(Categoria, on_delete=models.PROTECT, related_name='productos', null=True, blank=True) # models.PROTECT evita que se elimine por categoria (en este caso)
    codigo = models.CharField(max_length=50, unique=True)                                                               # Agregamos null= True de forma temportal mientras creamos la base de datos
    nombre = models.CharField(max_length = 50)
    precio = models.DecimalField(max_digits=20, decimal_places=2, validators=[MinValueValidator(0)]) # MinValueValidator nos permite darle un valor minimo a un dato (en este caso 0 por ser un precio)
    stock = models.PositiveIntegerField(default=0)
    descripcion = models.TextField(blank=True) # blanck= nos permite establecer si permitimos que el campo pueda quedar vacio o no

    def __str__(self):

        return self.nombre

**Acciones**
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


### Endpoints
| Método | Ruta | Descripción | Ejemplo de respuesta |
|---|---|---|---|
| GET | /api/servicios/ | Lista los servicios activos | (JSON) |

### Panel de administración

admin.site.register(Categoria)
admin.site.register(Productos) #registran los modelos en el panel de administracion Django
admin.site.register(Acciones)

## 7. Configuración de Django
- **Entorno virtual:** python -m venv entorno
- **Instalación:** pip install -r requirements.txt

- **Cambios realizados en settings.py:** Agregacion del CORS y JWT para que funcionen el django y React al mismo tiempo junto a con autentificacion de tokens para iniciar sesion

- **usuario:** simon, simon.rojas1289@gmail.com

- **Urls Backend**

Inventario: 

router = DefaultRouter()

router.register("registro_productos", ProductosViewSet, basename ="Productos")
router.register("registro_categorias", CategoriaViewSet, basename ="Categoria")
router.register("registro_Acciones", AccionesViewSet, basename ="Acciones")

Config:

urlpatterns = [

    path('admin/', admin.site.urls),
    path('api/', include('inventario.urls')), # Vinculacion con el inventario

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # Esta es la encargada de obtener el token de acceso junto a renovar este mismo cuando expire
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # Lo que hace es obtener un nuevo token de acceso cuando en anterior expira
]

urlpatterns = [path("", include(router.urls)),]

## 8. Configuración de React
- **Comando de creación:** npm create vite@latest

- **Configuración de integración con Django:** 
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]


- **Puerto y URL:**
frontend:

http://localhost:5173/

backend:

http://127.0.0.1:8000/
