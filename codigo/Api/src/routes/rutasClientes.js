const express = require('express');
const router = express.Router();

const {
  listarClientes,
  detalleCliente,
  insertarCliente,
  actualizarCliente,
  eliminarCliente
} = require('../controllers/controladorClientes');

router.post('/buscar', listarClientes);
router.get('/:id', detalleCliente);

router.post('/', insertarCliente);
router.put('/:id', actualizarCliente);
router.delete('/:id', eliminarCliente);

module.exports = router;