const pool = require('../db')

const obtenerPerfil = async (req, res) => {
  const { registro_academico } = req.params
  try {
    const resultado = await pool.query(`
      SELECT id_usuario, registro_academico, nombres, apellidos, correo
      FROM usuario WHERE registro_academico = $1
    `, [registro_academico])

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' })
    }
    res.json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

const actualizarPerfil = async (req, res) => {
  const { id_usuario } = req.params
  const { nombres, apellidos, correo } = req.body

  try {
    await pool.query(`
      UPDATE usuario SET nombres = $1, apellidos = $2, correo = $3
      WHERE id_usuario = $4
    `, [nombres, apellidos, correo, id_usuario])

    res.json({ mensaje: 'Perfil actualizado correctamente' })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

const obtenerCursosAprobados = async (req, res) => {
  const { id_usuario } = req.params
  try {
    const resultado = await pool.query(`
      SELECT ca.id_registro, ca.fecha_aprobacion,
             c.nombre_curso, c.creditos, c.area
      FROM curso_aprobado ca
      JOIN curso c ON ca.id_curso = c.id_curso
      WHERE ca.usuario_id_usuario = $1
    `, [id_usuario])

    const totalCreditos = resultado.rows.reduce((sum, c) => sum + c.creditos, 0)
    res.json({ cursos: resultado.rows, total_creditos: totalCreditos })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

const agregarCursoAprobado = async (req, res) => {
  const { id_usuario } = req.params
  const { id_registro, id_curso } = req.body

  try {
    await pool.query(`
      INSERT INTO curso_aprobado (id_registro, id_usuario, id_curso, fecha_aprobacion, usuario_id_usuario)
      VALUES ($1, $2, $3, CURRENT_DATE, $2)
    `, [id_registro, id_usuario, id_curso])

    res.status(201).json({ mensaje: 'Curso aprobado agregado correctamente' })
  } catch (error) {
    console.error('ERROR AL AGREGAR CURSO APROBADO:', error);
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

const obtenerUsuarioPorRegistro = async (req, res) => {
  const { registro_academico } = req.params
  try {
    const resultado = await pool.query(`
      SELECT id_usuario, registro_academico, nombres, apellidos, correo
      FROM usuario WHERE registro_academico = $1
    `, [registro_academico])

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' })
    }
    res.json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

module.exports = { obtenerPerfil, actualizarPerfil, obtenerCursosAprobados, agregarCursoAprobado, obtenerUsuarioPorRegistro }