const express = require('express')
const router = express.Router()
const verificarToken = require('../intermediario/authMiddleware')
const { obtenerComentarios, crearComentario } = require('../controlador/comentarioController')

router.get('/:id_publicacion', obtenerComentarios)
router.post('/:id_publicacion', verificarToken, crearComentario)

module.exports = router