const express = require("express");

const {
  listarCategoriasCliente,
  listarMetodosEntrega,
  listarCategoriasProveedor,
  listarGruposProductos,
} = require("../controllers/controladorFiltros");

const router = express.Router();

router.get("/categorias-clientes", listarCategoriasCliente);
router.get("/metodos-entrega", listarMetodosEntrega);
router.get("/categorias-proveedores", listarCategoriasProveedor);
router.get("/grupos-productos", listarGruposProductos);

module.exports = router;
