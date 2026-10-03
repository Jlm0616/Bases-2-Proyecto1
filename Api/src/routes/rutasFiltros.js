const express = require("express");

const {
  listarCategoriasCliente,
  listarMetodosEntrega,
  listarCategoriasProveedor,
  listarGruposProductos,
  listarPersonas,
  listarCiudades,
  listarGruposCompra,
  listarAniosVentas,
  listarAniosCompras,
  listarCategoriasProducto,
  listarProveedores,
  listarProductos,
} = require("../controllers/controladorFiltros");

const router = express.Router();

router.get("/categorias-clientes", listarCategoriasCliente);
router.get("/metodos-entrega", listarMetodosEntrega);
router.get("/categorias-proveedores", listarCategoriasProveedor);
router.get("/grupos-productos", listarGruposProductos);
router.get("/personas", listarPersonas);
router.get("/ciudades", listarCiudades);
router.get("/grupos-compra", listarGruposCompra);

router.get("/anios-ventas", listarAniosVentas);
router.get("/anios-compras", listarAniosCompras);
router.get("/categorias-producto", listarCategoriasProducto);
router.get("/proveedores", listarProveedores);
router.get("/productos", listarProductos);

module.exports = router;
