const express = require('express')
const router = express.Router()
const verificarToken = require('../intermediario/authMiddleware')
const { obtenerPublicaciones, obtenerPorCurso, obtenerPorCatedratico, crearPublicacion } = require('../controlador/publicacionController')

router.get('/', obtenerPublicaciones)
router.get('/curso/:id_curso', obtenerPorCurso)
router.get('/catedratico/:id_catedratico', obtenerPorCatedratico)
router.post('/', verificarToken, crearPublicacion)

module.exports = router