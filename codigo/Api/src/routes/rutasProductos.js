const express = require('express');
const router = express.Router();

const {
  listarProductos,
  detalleProducto,
  insertarProducto,
  actualizarProducto,
  eliminarProducto
} = require('../controllers/controladorProductos');

router.post('/buscar', listarProductos);
router.get('/:id', detalleProducto);

router.post('/', insertarProducto);
router.put('/:id', actualizarProducto);
router.delete('/:id', eliminarProducto);

module.exports = router;