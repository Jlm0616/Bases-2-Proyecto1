const express = require("express");

const {
  listarCategoriasCliente,
  listarMetodosEntrega,
  listarCategoriasProveedor,
  listarGruposProductos,
  listarPersonas,
  listarCiudades,
  listarGruposCompra,
} = require("../controllers/controladorFiltros");

const router = express.Router();

router.get("/categorias-clientes", listarCategoriasCliente);
router.get("/metodos-entrega", listarMetodosEntrega);
router.get("/categorias-proveedores", listarCategoriasProveedor);
router.get("/grupos-productos", listarGruposProductos);
router.get("/personas", listarPersonas);
router.get("/ciudades", listarCiudades);
router.get("/grupos-compra", listarGruposCompra);

module.exports = router;
