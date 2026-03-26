const express = require('express')
const router = express.Router()
const verificarToken = require('../intermediario/authMiddleware')
const { obtenerPerfil, actualizarPerfil, obtenerCursosAprobados, agregarCursoAprobado } = require('../controlador/usuarioController')

router.get('/:registro_academico', obtenerPerfil)
router.put('/:id_usuario', verificarToken, actualizarPerfil)
router.get('/:id_usuario/cursos-aprobados', obtenerCursosAprobados)
router.post('/:id_usuario/cursos-aprobados', verificarToken, agregarCursoAprobado)

module.exports = router