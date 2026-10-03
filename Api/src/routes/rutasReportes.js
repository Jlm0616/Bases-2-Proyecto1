const express = require('express');
const router = express.Router();

const {
  montosProveedores,
  montosClientes,
  top5ProductosGanancia,
  top5ClientesFacturas,
  top5ProveedoresOrdenes,
  matrizVentasPorCategoria,
  seguimientoComprasCliente,
  seguimientoComprasProveedor,
  rotacionInventario,
  metodoEnvioFavoritoPorZona
} = require('../controllers/controladorReportes');

// Todos los reportes aceptan POST (body) y GET (query)

router.post('/montos-proveedores', montosProveedores);
router.get('/montos-proveedores', montosProveedores);

router.post('/montos-clientes', montosClientes);
router.get('/montos-clientes', montosClientes);

router.post('/top-productos', top5ProductosGanancia);
router.get('/top-productos', top5ProductosGanancia);

router.post('/top-clientes', top5ClientesFacturas);
router.get('/top-clientes', top5ClientesFacturas);

router.post('/top-proveedores', top5ProveedoresOrdenes);
router.get('/top-proveedores', top5ProveedoresOrdenes);

router.get('/matriz-ventas-categorias', matrizVentasPorCategoria);

router.post('/seguimiento-clientes', seguimientoComprasCliente);
router.get('/seguimiento-clientes', seguimientoComprasCliente);

router.post('/seguimiento-proveedores', seguimientoComprasProveedor);
router.get('/seguimiento-proveedores', seguimientoComprasProveedor);

router.post('/rotacion-inventario', rotacionInventario);
router.get('/rotacion-inventario', rotacionInventario);

router.post('/metodo-envio-favorito', metodoEnvioFavoritoPorZona);
router.get('/metodo-envio-favorito', metodoEnvioFavoritoPorZona);

module.exports = router;