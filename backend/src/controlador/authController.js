const pool = require('../db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const registrar = async (req, res) => {
  const { id_usuario, registro_academico, nombres, apellidos, correo, contrasena } = req.body

  try {
    const existe = await pool.query(
      'SELECT * FROM usuario WHERE correo = $1 OR registro_academico = $2',
      [correo, registro_academico]
    )

    if (existe.rows.length > 0) {
      return res.status(400).json({ mensaje: 'El correo o registro académico ya está en uso' })
    }

    const contrasenaEncriptada = await bcrypt.hash(contrasena, 10)

    await pool.query(
      'INSERT INTO usuario (id_usuario, registro_academico, nombres, apellidos, correo, contraseña) VALUES ($1, $2, $3, $4, $5, $6)',
      [id_usuario, registro_academico, nombres, apellidos, correo, contrasenaEncriptada]
    )

    res.status(201).json({ mensaje: 'Usuario registrado correctamente' })
  } catch (error) {
    console.error('ERROR EN EL BACKEND (Registro):', error); 
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

const login = async (req, res) => {
  const { registro_academico, contrasena } = req.body

  try {
    const resultado = await pool.query(
      'SELECT * FROM usuario WHERE registro_academico = $1',
      [registro_academico]
    )

    if (resultado.rows.length === 0) {
      return res.status(400).json({ mensaje: 'Usuario no encontrado' })
    }

    const usuario = resultado.rows[0]
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contraseña)

    if (!contrasenaValida) {
      return res.status(400).json({ mensaje: 'Contraseña incorrecta' })
    }

    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, nombres: usuario.nombres },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        registro_academico: usuario.registro_academico,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        correo: usuario.correo
        
      }
    })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

const recuperarContrasena = async (req, res) => {
  const { registro_academico, correo, nueva_contrasena } = req.body

  try {
    const resultado = await pool.query(
      'SELECT * FROM usuario WHERE registro_academico = $1 AND correo = $2',
      [registro_academico, correo]
    )

    if (resultado.rows.length === 0) {
      return res.status(400).json({ mensaje: 'Los datos no coinciden con ningún usuario' })
    }

    const contrasenaEncriptada = await bcrypt.hash(nueva_contrasena, 10)

    await pool.query(
      'UPDATE usuario SET contraseña = $1 WHERE registro_academico = $2',
      [contrasenaEncriptada, registro_academico]
    )

    res.json({ mensaje: 'Contraseña actualizada correctamente' })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

module.exports = { registrar, login, recuperarContrasena }