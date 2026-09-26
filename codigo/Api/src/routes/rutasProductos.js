const express = require('express');
const router = express.Router();

const {
  listarProductos,
  detalleProducto
} = require('../controllers/controladorProductos');

router.post('/buscar', listarProductos);
router.get('/:id', detalleProducto);

module.exports = router;
