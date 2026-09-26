const express = require('express');
const router = express.Router();

const {
  listarProveedores,
  detalleProveedor
} = require('../controllers/controladorProveedores');

router.post('/buscar', listarProveedores);
router.get('/:id', detalleProveedor);

module.exports = router;
