import api from './api'

export const login = (datos) => api.post('/auth/login', datos)
export const registro = (datos) => api.post('/auth/registro', datos)
export const recuperarContrasena = (datos) => api.post('/auth/recuperar-contrasena', datos)