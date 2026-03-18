const express = require('express')
const cors = require('cors')
require('dotenv').config()
require('./src/db') // Inicia la conexión a la BD

const app = express()

// Middleware - le dice al servidor que puede recibir y enviar JSON
app.use(cors())
app.use(express.json())
const authRoutes = require('./src/rutas/authRoutes')
app.use('/api/auth', authRoutes)

const publicacionRoutes = require('./src/rutas/publicacionRoutes')
app.use('/api/publicaciones', publicacionRoutes)

const comentarioRoutes = require('./src/rutas/comentarioRoutes')
app.use('/api/comentarios', comentarioRoutes)

const usuarioRoutes = require('./src/rutas/usuarioRoutes')
app.use('/api/usuarios', usuarioRoutes)

const catedraticoCursoRoutes = require('./src/rutas/catedraticoCursoRoutes')
app.use('/api', catedraticoCursoRoutes)

// Ruta de prueba - para verificar que el servidor funciona
app.get('/', (req, res) => {
  res.json({ mensaje: 'Servidor Corriendo :D' })
})

// Puerto donde escucha el servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})