import axios from 'axios'

export const ENDPOINTS = {
  productos: '/api/registro_productos/',
  categorias: '/api/registro_categorias/', // Rutas especificadas en el backend (pra no escribirlas siempre)
  acciones: '/api/registro_Acciones/',
}


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {'Content-Type': 'application/json',}, // Configuracion del axios
})


api.interceptors.request.use((config) => { //El interceptor se ejecutará antes de enviar la petición, revisa si ya existe un un token JWT

  const token = localStorage.getItem('access') // Obtiene el token de acceso generado con el JWT

  if (token) {  //Comprueba si el token se encuentra registrado
    config.headers.Authorization = `Bearer ${token}` //le estamos agregando el token al encabezado http del request
  }
  return config
})




export async function login(username, password) {
  const response = await api.post('/api/token/', {username,password,})

  localStorage.setItem('access', response.data.access)  //Guarda las credenciales de acceso
  localStorage.setItem('refresh', response.data.refresh)

  return response.data
}


export function logout() {
  localStorage.removeItem('access')   // Exportacion de cerrar sesion, elimina las credenciales para que asi no se mantenga la sesion
  localStorage.removeItem('refresh')
}

export default api   //Exportacion del axios