/**
 * Rutas para clientes
 * @param {Object} router - Objeto router de Express
 */
const express = require('express');
const router = express.Router();

const {
  listarClientes,
  detalleCliente,
  insertarCliente,
  actualizarCliente,
  eliminarCliente
} = require('../controllers/controladorClientes');

// Listar (POST con body y GET con query, ambos soportados)
router.post('/buscar', listarClientes);
router.get('/', listarClientes);
router.get('/buscar', listarClientes);

// Rutas con :id al final (más específicas primero)
router.get('/:id', detalleCliente);
router.post('/', insertarCliente);
router.put('/:id', actualizarCliente);
router.delete('/:id', eliminarCliente);

module.exports = router;