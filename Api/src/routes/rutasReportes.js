const express = require('express');
const router = express.Router();

const {
  montosProveedores,
  montosClientes,
  top5ProductosGanancia,
  top5ClientesFacturas,
  top5ProveedoresOrdenes
} = require('../controllers/controladorReportes');

router.post('/montos-proveedores', montosProveedores);
router.post('/montos-clientes', montosClientes);
router.post('/top-productos', top5ProductosGanancia);
router.post('/top-clientes', top5ClientesFacturas);
router.post('/top-proveedores', top5ProveedoresOrdenes);

module.exports = router;
