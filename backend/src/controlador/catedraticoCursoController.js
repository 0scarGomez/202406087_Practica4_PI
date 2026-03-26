const pool = require('../db')

const obtenerCatedraticos = async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM catedratico')
    res.json(resultado.rows)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

const obtenerCursos = async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM curso')
    res.json(resultado.rows)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

module.exports = { obtenerCatedraticos, obtenerCursos }