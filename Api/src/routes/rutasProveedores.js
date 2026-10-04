/**
 * Rutas para proveedores
 * @param {Object} router - Objeto router de Express
 */
const express = require('express');
const router = express.Router();

const {
  listarProveedores,
  detalleProveedor,
  insertarProveedor,
  actualizarProveedor,
  eliminarProveedor
} = require('../controllers/controladorProveedores');

// Listar (POST con body y GET con query, ambos soportados)
router.post('/buscar', listarProveedores);
router.get('/', listarProveedores);
router.get('/buscar', listarProveedores);

// Rutas con :id al final (más específicas primero)
router.get('/:id', detalleProveedor);
router.post('/', insertarProveedor);
router.put('/:id', actualizarProveedor);
router.delete('/:id', eliminarProveedor);

module.exports = router;