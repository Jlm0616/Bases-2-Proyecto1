USE WideWorldImporters;
GO

-- ============================================
-- SINÓNIMOS - Módulo Clientes
-- ============================================
CREATE SYNONYM Cli_Clientes              FOR Sales.Customers;
CREATE SYNONYM Cli_CategoriasCliente     FOR Sales.CustomerCategories;
CREATE SYNONYM Cli_GruposCompra          FOR Sales.BuyingGroups;

-- ============================================
-- SINÓNIMOS - Módulo Proveedores
-- ============================================
CREATE SYNONYM Prov_Proveedores          FOR Purchasing.Suppliers;
CREATE SYNONYM Prov_CategoriasProveedor  FOR Purchasing.SupplierCategories;

-- ============================================
-- SINÓNIMOS - Módulo Inventario / Productos
-- ============================================
CREATE SYNONYM Inv_Articulos             FOR Warehouse.StockItems;
CREATE SYNONYM Inv_GruposArticulo        FOR Warehouse.StockGroups;
CREATE SYNONYM Inv_ArticuloGrupo         FOR Warehouse.StockItemStockGroups;
CREATE SYNONYM Inv_ExistenciasArticulo   FOR Warehouse.StockItemHoldings;

-- ============================================
-- SINÓNIMOS - Módulo Ventas
-- ============================================
CREATE SYNONYM Vta_Facturas              FOR Sales.Invoices;
CREATE SYNONYM Vta_LineasFactura         FOR Sales.InvoiceLines;

-- ============================================
-- SINÓNIMOS - Compras (para reportes de proveedores)
-- ============================================
CREATE SYNONYM Cmp_OrdenesCompra         FOR Purchasing.PurchaseOrders;
CREATE SYNONYM Cmp_LineasOrdenCompra     FOR Purchasing.PurchaseOrderLines;

-- ============================================
-- SINÓNIMOS - Comunes (contactos, direcciones, entrega)
-- ============================================
CREATE SYNONYM Gen_Personas              FOR Application.People;
CREATE SYNONYM Gen_MetodosEntrega        FOR Application.DeliveryMethods;
CREATE SYNONYM Gen_Ciudades              FOR Application.Cities;
CREATE SYNONYM Gen_Provincias            FOR Application.StateProvinces;
CREATE SYNONYM Gen_Paises                FOR Application.Countries;

-- ============================================
-- SINÓNIMOS - Módulo Inventario (extra: color y empaque)
-- ============================================
CREATE SYNONYM Inv_Colores       FOR Warehouse.Colors;
CREATE SYNONYM Inv_TiposEmpaque  FOR Warehouse.PackageTypes;
GO