SET QUOTED_IDENTIFIER ON;
GO
USE WideWorldImporters;
GO

-- ============================================================
-- SCRIPT DE EJEMPLOS DE EJECUCION
-- Proyecto 1 - Bases de Datos 2
-- Contiene un EXEC de ejemplo para cada procedimiento almacenado
-- usado en la aplicacion (modulos, reportes y CRUD transaccional)
--
-- IDEMPOTENTE: se puede ejecutar múltiples veces sin efectos
-- acumulativos. Al final restaura el stock consumido por la
-- prueba de Vta_sp_InsertarVenta.
-- ============================================================

-- ============================================================
-- MODULO CLIENTES
-- ============================================================
PRINT '--- Cli_sp_ListarClientes ---';
EXEC Cli_sp_ListarClientes @Nombre = 'Tailspin';

PRINT '--- Cli_sp_DetalleCliente ---';
EXEC Cli_sp_DetalleCliente @CustomerID = 189;

PRINT '--- Cli_sp_InsertarCliente ---';
DECLARE @NuevoClienteID INT;
EXEC Cli_sp_InsertarCliente
    @NombreCliente = 'Cliente de Ejemplo',
    @CategoriaID = 1,
    @MetodoEntregaID = 1,
    @PrimaryContactID = 1361,
    @DeliveryCityID = 1,
    @LastEditedBy = 1361,
    @NuevoID = @NuevoClienteID OUTPUT;

PRINT '--- Cli_sp_ActualizarCliente ---';
EXEC Cli_sp_ActualizarCliente
    @CustomerID = @NuevoClienteID,
    @NombreCliente = 'Cliente de Ejemplo Editado',
    @CategoriaID = 2,
    @MetodoEntregaID = 1,
    @LastEditedBy = 1361;

PRINT '--- Cli_sp_EliminarCliente ---';
EXEC Cli_sp_EliminarCliente @CustomerID = @NuevoClienteID;
GO

-- ============================================================
-- MODULO PROVEEDORES
-- ============================================================
PRINT '--- Prov_sp_ListarProveedores ---';
EXEC Prov_sp_ListarProveedores;

PRINT '--- Prov_sp_DetalleProveedor ---';
EXEC Prov_sp_DetalleProveedor @SupplierID = 13;

PRINT '--- Prov_sp_InsertarProveedor ---';
DECLARE @NuevoProveedorID INT;
EXEC Prov_sp_InsertarProveedor
    @NombreProveedor = 'Proveedor de Ejemplo',
    @CategoriaID = 1,
    @PrimaryContactID = 1361,
    @AlternateContactID = 1361,
    @MetodoEntregaID = 1,
    @DeliveryCityID = 1,
    @LastEditedBy = 1361,
    @NuevoID = @NuevoProveedorID OUTPUT;

PRINT '--- Prov_sp_ActualizarProveedor ---';
EXEC Prov_sp_ActualizarProveedor
    @SupplierID = @NuevoProveedorID,
    @NombreProveedor = 'Proveedor de Ejemplo Editado',
    @CategoriaID = 2,
    @MetodoEntregaID = 1,
    @LastEditedBy = 1361;

PRINT '--- Prov_sp_EliminarProveedor ---';
EXEC Prov_sp_EliminarProveedor @SupplierID = @NuevoProveedorID;
GO

-- ============================================================
-- MODULO PRODUCTOS
-- ============================================================
PRINT '--- Inv_sp_ListarProductos ---';
EXEC Inv_sp_ListarProductos;

PRINT '--- Inv_sp_DetalleProducto ---';
EXEC Inv_sp_DetalleProducto @StockItemID = 227;

PRINT '--- Inv_sp_InsertarProducto ---';
DECLARE @NuevoProductoID INT;
EXEC Inv_sp_InsertarProducto
    @NombreProducto = 'Producto de Ejemplo',
    @SupplierID = 1,
    @UnitPackageID = 1,
    @OuterPackageID = 2,
    @LastEditedBy = 1361,
    @UnitPrice = 10.00,
    @NuevoID = @NuevoProductoID OUTPUT;

PRINT '--- Inv_sp_ActualizarProducto ---';
EXEC Inv_sp_ActualizarProducto
    @StockItemID = @NuevoProductoID,
    @NombreProducto = 'Producto de Ejemplo Editado',
    @SupplierID = 1,
    @UnitPrice = 15.00,
    @LastEditedBy = 1361;

PRINT '--- Inv_sp_EliminarProducto ---';
EXEC Inv_sp_EliminarProducto @StockItemID = @NuevoProductoID;
GO

-- ============================================================
-- MODULO VENTAS
-- ============================================================
PRINT '--- Vta_sp_ListarVentas ---';
EXEC Vta_sp_ListarVentas @NombreCliente = 'Tailspin';

PRINT '--- Vta_sp_DetalleVenta ---';
EXEC Vta_sp_DetalleVenta @InvoiceID = 67361;

PRINT '--- Vta_sp_InsertarVenta ---';
DECLARE @Lineas TipoLineasFactura;
INSERT INTO @Lineas (StockItemID, Quantity, UnitPrice) VALUES (1, 5, 10.00), (2, 3, 25.50);
DECLARE @NuevaVentaID INT;
EXEC Vta_sp_InsertarVenta
    @CustomerID = 1,
    @ContactPersonID = 1361,
    @SalespersonPersonID = 1361,
    @LastEditedBy = 1361,
    @Lineas = @Lineas,
    @NuevoID = @NuevaVentaID OUTPUT;

PRINT '--- Vta_sp_ActualizarVenta ---';
EXEC Vta_sp_ActualizarVenta
    @InvoiceID = @NuevaVentaID,
    @DeliveryInstructions = 'Entregar en la manana',
    @LastEditedBy = 1361;

PRINT '--- Vta_sp_EliminarVenta ---';
EXEC Vta_sp_EliminarVenta @InvoiceID = @NuevaVentaID;
GO

-- ============================================================
-- REPORTES Y ESTADISTICAS
-- ============================================================
PRINT '--- Rpt_sp_MontosProveedores (Reporte 1) ---';
EXEC Rpt_sp_MontosProveedores;

PRINT '--- Rpt_sp_MontosClientes (Reporte 2) ---';
EXEC Rpt_sp_MontosClientes @NombreCliente = 'Tailspin';

PRINT '--- Rpt_sp_Top5ProductosPorGanancia (Reporte 3) ---';
EXEC Rpt_sp_Top5ProductosPorGanancia @Anio = 2015;

PRINT '--- Rpt_sp_Top5ClientesPorFacturas (Reporte 4) ---';
EXEC Rpt_sp_Top5ClientesPorFacturas @AnioInicio = 2015, @AnioFin = 2016;

PRINT '--- Rpt_sp_Top5ProveedoresPorOrdenes (Reporte 5) ---';
EXEC Rpt_sp_Top5ProveedoresPorOrdenes @AnioInicio = 2015, @AnioFin = 2016;

PRINT '--- Rpt_sp_MatrizVentasPorCategoria (Reporte 6) ---';
EXEC Rpt_sp_MatrizVentasPorCategoria;

PRINT '--- Rpt_sp_SeguimientoComprasCliente (Reporte 7) ---';
EXEC Rpt_sp_SeguimientoComprasCliente @Anio = 2015, @Mes = 3;

PRINT '--- Rpt_sp_SeguimientoComprasProveedor (Reporte 8) ---';
EXEC Rpt_sp_SeguimientoComprasProveedor @Anio = 2015;

PRINT '--- Rpt_sp_RotacionInventario (Reporte 9) ---';
EXEC Rpt_sp_RotacionInventario @Anio = 2015;

PRINT '--- Rpt_sp_MetodoEnvioFavoritoPorZona (Reporte 10) ---';
EXEC Rpt_sp_MetodoEnvioFavoritoPorZona @Anio = 2015;
GO

-- ============================================================
-- LIMPIEZA: restaurar stock consumido por la prueba de ventas
-- (Vta_sp_InsertarVenta descuenta QuantityOnHand de los
--  productos 1 y 2 en 5 y 3 unidades respectivamente)
-- ============================================================
PRINT '--- Restaurando stock consumido por las pruebas ---';
UPDATE Inv_ExistenciasArticulo
SET QuantityOnHand = QuantityOnHand + 5
WHERE StockItemID = 1;

UPDATE Inv_ExistenciasArticulo
SET QuantityOnHand = QuantityOnHand + 3
WHERE StockItemID = 2;
PRINT '--- Stock restaurado ---';
GO