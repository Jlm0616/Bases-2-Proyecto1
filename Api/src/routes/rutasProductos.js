const express = require('express');
const router = express.Router();

const {
  listarProductos,
  detalleProducto,
  insertarProducto,
  actualizarProducto,
  eliminarProducto
} = require('../controllers/controladorProductos');

// Listar (POST con body y GET con query, ambos soportados)
router.post('/buscar', listarProductos);
router.get('/', listarProductos);
router.get('/buscar', listarProductos);

// Rutas con :id al final (más específicas primero)
router.get('/:id', detalleProducto);
router.post('/', insertarProducto);
router.put('/:id', actualizarProducto);
router.delete('/:id', eliminarProducto);

module.exports = router;