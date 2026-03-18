const express = require('express')
const router = express.Router()
const verificarToken = require('../intermediario/authMiddleware')
const { obtenerPerfil, actualizarPerfil, obtenerCursosAprobados } = require('../controlador/usuarioController')

router.get('/:id_usuario', obtenerPerfil)
router.put('/:id_usuario', verificarToken, actualizarPerfil)
router.get('/:id_usuario/cursos-aprobados', obtenerCursosAprobados)

module.exports = router