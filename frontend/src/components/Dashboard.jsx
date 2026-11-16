import { useState } from 'react'
import ProductosList from './ProductosList'
import CategoriasList from './CategoriasList'

function Dashboard({ onLogout }) {
  const [seccion, setSeccion] = useState('inicio')

  return (
    <div className="contenedor-panel">

      <header className="encabezado-panel">
        <h1>SuperMarket Manager</h1>

        <button onClick={onLogout}>
          Cerrar sesión
        </button>
      </header>

      <main className="contenido-panel">

        {seccion === 'inicio' ? (
          <>
            <h2>Panel principal</h2>
            <p>¡Bienvenido al sistema de gestión de inventario!</p>

            <div className="menu-panel">

              <div className="tarjeta-panel">
                <h3>Productos</h3>
                <p>Registrar, consultar, editar y eliminar productos.</p>

                <button onClick={() => setSeccion('productos')}>
                  Administrar productos
                </button>
              </div>

              <div className="tarjeta-panel">
                <h3>Categorías</h3>
                <p>Administrar las categorías de los productos.</p>

                <button onClick={() => setSeccion('categorias')}>
                  Administrar categorías
                </button>
              </div>

              <div className="tarjeta-panel">
                <h3>Movimientos</h3>
                <p>Registrar ingresos y retiros de stock.</p>
              </div>

              <div className="tarjeta-panel">
                <h3>Historial</h3>
                <p>Consultar los movimientos del inventario.</p>
              </div>

            </div>
          </>
        ) : seccion === 'productos' ? (
          <>
            <button onClick={() => setSeccion('inicio')}>
              Volver al panel principal
            </button>

            <ProductosList />
          </>
        ) : (
          <>
            <button onClick={() => setSeccion('inicio')}>
              Volver al panel principal
            </button>

            <CategoriasList />
          </>
        )}

      </main>
    </div>
  )
}

export default Dashboard