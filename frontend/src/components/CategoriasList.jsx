import { useState, useEffect } from 'react'
import api, { ENDPOINTS } from '../api/client'
import CategoriaForm from './CategoriaForm'

function CategoriasList() {

  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [categoriaEditar, setCategoriaEditar] = useState(null)

  // OBTENER CATEGORIAS
  const obtenerCategorias = async () => {
    setCargando(true)
    setError('')

    try {
      const respuesta = await api.get(ENDPOINTS.categorias)

      setCategorias(respuesta.data.results || respuesta.data)

    } catch (error) {
      setError('No se pudieron obtener las categorías.')
    } finally {
      setCargando(false)
    }
  }

  // EJECUTAR AL CARGAR EL COMPONENTE
  useEffect(() => {
    obtenerCategorias()
  }, [])

  // REGISTRAR CATEGORIA
  const nuevaCategoria = () => {
    setCategoriaEditar(null)
    setMostrarFormulario(true)
  }

  // EDITAR CATEGORIA
  const editarCategoria = (categoria) => {
    setCategoriaEditar(categoria)
    setMostrarFormulario(true)
  }

  // GUARDAR CATEGORIA
  const guardarCategoria = () => {
    setMostrarFormulario(false)
    setCategoriaEditar(null)
    obtenerCategorias()
  }

  // CANCELAR FORMULARIO
  const cancelarFormulario = () => {
    setMostrarFormulario(false)
    setCategoriaEditar(null)
  }

  return (
    <div>

      {mostrarFormulario ? (

        <CategoriaForm
          categoria={categoriaEditar}
          onGuardar={guardarCategoria}
          onCancelar={cancelarFormulario}
        />

      ) : (

        <>

          <h2>Lista de categorías</h2>

          <button onClick={nuevaCategoria}>
            Registrar categoría
          </button>

          {cargando && <p>Cargando categorías...</p>}

          {error && <p>{error}</p>}

          {!cargando && !error && categorias.length === 0 && (
            <p>No hay categorías registradas.</p>
          )}

          {categorias.map((categoria) => (

            <div key={categoria.id}>

              <h3>{categoria.nombre}</h3>

              <p>Descripción: {categoria.descripcion}</p>

              <button onClick={() => editarCategoria(categoria)}>
                Editar
              </button>

            </div>

          ))}

        </>

      )}

    </div>
  )
}

export default CategoriasList