const express = require('express');
const router = express.Router();

const {
  listarVentas,
  detalleVenta
} = require('../controllers/controladorVentas');

router.post('/buscar', listarVentas);
router.get('/:id', detalleVenta);

module.exports = router;
