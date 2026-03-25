import api from './api'

export const obtenerPublicaciones = () => api.get('/publicaciones')
export const obtenerPorCurso = (id) => api.get(`/publicaciones/curso/${id}`)
export const obtenerPorCatedratico = (id) => api.get(`/publicaciones/catedratico/${id}`)
export const crearPublicacion = (datos) => api.post('/publicaciones', datos)