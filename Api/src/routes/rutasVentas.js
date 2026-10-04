/**
 * Rutas para ventas
 * @param {Object} router - Objeto router de Express
 */
const express = require('express');
const router = express.Router();

const {
  listarVentas,
  detalleVenta,
  insertarVenta,
  actualizarVenta,
  eliminarVenta
} = require('../controllers/controladorVentas');

// Listar (POST con body y GET con query, ambos soportados)
router.post('/buscar', listarVentas);
router.get('/', listarVentas);
router.get('/buscar', listarVentas);

// Rutas con :id al final (más específicas primero)
router.get('/:id', detalleVenta);
router.post('/', insertarVenta);
router.put('/:id', actualizarVenta);
router.delete('/:id', eliminarVenta);

module.exports = router;