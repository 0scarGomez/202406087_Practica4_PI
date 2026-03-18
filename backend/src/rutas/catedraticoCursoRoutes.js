const express = require('express')
const router = express.Router()
const { obtenerCatedraticos, obtenerCursos } = require('../controlador/catedraticoCursoController')

router.get('/catedraticos', obtenerCatedraticos)
router.get('/cursos', obtenerCursos)

module.exports = router