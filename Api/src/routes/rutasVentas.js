const express = require('express');
const router = express.Router();

const {
  listarVentas,
  detalleVenta,
  insertarVenta,
  actualizarVenta,
  eliminarVenta
} = require('../controllers/controladorVentas');

router.post('/buscar', listarVentas);
router.get('/:id', detalleVenta);
router.post('/', insertarVenta);
router.put('/:id', actualizarVenta);
router.delete('/:id', eliminarVenta);

module.exports = router;