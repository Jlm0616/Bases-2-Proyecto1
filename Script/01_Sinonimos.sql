USE WideWorldImporters;
GO

-- ============================================================================
-- 01_Sinonimos.sql
-- Sinónimos de Base de Datos - Proyecto 1 Bases de Datos 2
--
-- Descripción:
--   Crea sinónimos para abreviar los nombres de las tablas de WideWorldImporters.
--   Los sinónimos facilitan la escritura de consultas y hacen el código más
--   legible usando prefijos que indican el módulo al que pertenece la tabla.
--
-- Prefijos utilizados:
--   Cli_  - Módulo de Clientes (Sales)
--   Prov_ - Módulo de Proveedores (Purchasing)
--   Inv_  - Módulo de Inventario (Warehouse)
--   Vta_  - Módulo de Ventas (Sales)
--   Cmp_  - Módulo de Compras (Purchasing)
--   Gen_  - Tablas Comunes (Application)
-- ============================================================================

-- ============================================================================
-- SINÓNIMOS - Módulo Clientes
-- Referencia: Sales schema
-- ============================================================================
CREATE SYNONYM Cli_Clientes              FOR Sales.Customers;
CREATE SYNONYM Cli_CategoriasCliente     FOR Sales.CustomerCategories;
CREATE SYNONYM Cli_GruposCompra          FOR Sales.BuyingGroups;

-- ============================================================================
-- SINÓNIMOS - Módulo Proveedores
-- Referencia: Purchasing schema
-- ============================================================================
CREATE SYNONYM Prov_Proveedores          FOR Purchasing.Suppliers;
CREATE SYNONYM Prov_CategoriasProveedor  FOR Purchasing.SupplierCategories;

-- ============================================================================
-- SINÓNIMOS - Módulo Inventario / Productos
-- Referencia: Warehouse schema
-- ============================================================================
CREATE SYNONYM Inv_Articulos             FOR Warehouse.StockItems;
CREATE SYNONYM Inv_GruposArticulo        FOR Warehouse.StockGroups;
CREATE SYNONYM Inv_ArticuloGrupo         FOR Warehouse.StockItemStockGroups;
CREATE SYNONYM Inv_ExistenciasArticulo   FOR Warehouse.StockItemHoldings;

-- ============================================================================
-- SINÓNIMOS - Módulo Ventas
-- Referencia: Sales schema
-- ============================================================================
CREATE SYNONYM Vta_Facturas              FOR Sales.Invoices;
CREATE SYNONYM Vta_LineasFactura         FOR Sales.InvoiceLines;

-- ============================================================================
-- SINÓNIMOS - Módulo Compras
-- Referencia: Purchasing schema
-- Uso: Reportes de proveedores
-- ============================================================================
CREATE SYNONYM Cmp_OrdenesCompra         FOR Purchasing.PurchaseOrders;
CREATE SYNONYM Cmp_LineasOrdenCompra     FOR Purchasing.PurchaseOrderLines;

-- ============================================================================
-- SINÓNIMOS - Tablas Comunes
-- Referencia: Application schema
-- Uso: Contactos, direcciones, métodos de entrega
-- ============================================================================
CREATE SYNONYM Gen_Personas              FOR Application.People;
CREATE SYNONYM Gen_MetodosEntrega        FOR Application.DeliveryMethods;
CREATE SYNONYM Gen_Ciudades              FOR Application.Cities;
CREATE SYNONYM Gen_Provincias            FOR Application.StateProvinces;
CREATE SYNONYM Gen_Paises                FOR Application.Countries;

-- ============================================================================
-- SINÓNIMOS - Módulo Inventario (Adicional)
-- Referencia: Warehouse schema
-- Uso: Colores y tipos de empaque de productos
-- ============================================================================
CREATE SYNONYM Inv_Colores       FOR Warehouse.Colors;
CREATE SYNONYM Inv_TiposEmpaque  FOR Warehouse.PackageTypes;
GO