const express = require('express')
const router = express.Router()
const { registrar, login, recuperarContrasena } = require('../controlador/authController')

router.post('/registro', registrar)
router.post('/login', login)
router.post('/recuperar-contrasena', recuperarContrasena)

module.exports = router