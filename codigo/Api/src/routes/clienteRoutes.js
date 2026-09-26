const express = require('express');
const router = express.Router();

const {
  listarClientes,
  detalleCliente
} = require('../controllers/clienteController');

router.post('/buscar', listarClientes);
router.get('/:id', detalleCliente);

module.exports = router;