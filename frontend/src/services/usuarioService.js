import api from './api'

export const obtenerPerfil = (id) => api.get(`/usuarios/${id}`)
export const actualizarPerfil = (id, datos) => api.put(`/usuarios/${id}`, datos)
export const obtenerCursosAprobados = (id) => api.get(`/usuarios/${id}/cursos-aprobados`)