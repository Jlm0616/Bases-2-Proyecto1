const express = require('express');
const router = express.Router();

const {
  listarProveedores,
  detalleProveedor,
  insertarProveedor,
  actualizarProveedor,
  eliminarProveedor
} = require('../controllers/controladorProveedores');

router.post('/buscar', listarProveedores);
router.get('/:id', detalleProveedor);

router.post('/', insertarProveedor);
router.put('/:id', actualizarProveedor);
router.delete('/:id', eliminarProveedor);

module.exports = router;