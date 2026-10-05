USE WideWorldImporters;
GO

-- ============================================================================
-- Stored Procedure: Flt_sp_ListarCategoriasCliente
-- Descripción: Lista todas las categorías de clientes disponibles en el sistema
-- Uso: Se utiliza para cargar las opciones del filtro de categoría de cliente
-- Tabla origen: Cli_CategoriasCliente
-- Ordenamiento: Nombre de la categoría ascendente
-- Columnas retornadas:
--   - IdCategoriaCliente: Identificador único de la categoría
--   - NombreCategoriaCliente: Nombre descriptivo de la categoría
-- ============================================================================

CREATE OR ALTER PROCEDURE Flt_sp_ListarCategoriasCliente
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        CustomerCategoryID AS IdCategoriaCliente,
        CustomerCategoryName AS NombreCategoriaCliente
    FROM Cli_CategoriasCliente
    ORDER BY CustomerCategoryName;
END
GO


-- ============================================================================
-- Stored Procedure: Flt_sp_ListarMetodosEntrega
-- Descripción: Lista todos los métodos de entrega disponibles
-- Uso: Se utiliza para cargar las opciones del filtro de método de entrega
-- Tabla origen: Gen_MetodosEntrega
-- Ordenamiento: Nombre del método ascendente
-- Columnas retornadas:
--   - IdMetodoEntrega: Identificador único del método de entrega
--   - NombreMetodoEntrega: Nombre descriptivo del método de entrega
-- ============================================================================

CREATE OR ALTER PROCEDURE Flt_sp_ListarMetodosEntrega
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        DeliveryMethodID AS IdMetodoEntrega,
        DeliveryMethodName AS NombreMetodoEntrega
    FROM Gen_MetodosEntrega
    ORDER BY DeliveryMethodName ASC;
END
GO


-- ============================================================================
-- Stored Procedure: Flt_sp_ListarPersonas
-- Descripción: Lista todas las personas registradas en el sistema
-- Uso: Se utiliza para cargar opciones de contactos y usuarios
-- Tabla origen: Gen_Personas
-- Ordenamiento: Nombre completo de la persona ascendente
-- Columnas retornadas:
--   - IdPersona: Identificador único de la persona
--   - NombrePersona: Nombre completo de la persona
-- ============================================================================

CREATE OR ALTER PROCEDURE Flt_sp_ListarPersonas
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        PersonID AS IdPersona,
        FullName AS NombrePersona
    FROM Gen_Personas
    ORDER BY FullName ASC;
END
GO


-- ============================================================================
-- Stored Procedure: Flt_sp_ListarCiudades
-- Descripción: Lista todas las ciudades disponibles
-- Uso: Se utiliza para cargar opciones de ciudad de entrega y ciudad postal
-- Tabla origen: Gen_Ciudades
-- Ordenamiento: Nombre de la ciudad ascendente
-- Columnas retornadas:
--   - IdCiudad: Identificador único de la ciudad
--   - NombreCiudad: Nombre descriptivo de la ciudad
-- ============================================================================

CREATE OR ALTER PROCEDURE Flt_sp_ListarCiudades
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        CityID AS IdCiudad,
        CityName AS NombreCiudad
    FROM Gen_Ciudades
    ORDER BY CityName ASC;
END
GO


-- ============================================================================
-- Stored Procedure: Flt_sp_ListarGruposCompra
-- Descripción: Lista todos los grupos de compra disponibles
-- Uso: Se utiliza para cargar opciones de grupo de compra del cliente
-- Tabla origen: Cli_GruposCompra
-- Ordenamiento: Nombre del grupo ascendente
-- Columnas retornadas:
--   - IdGrupoCompra: Identificador único del grupo de compra
--   - NombreGrupoCompra: Nombre descriptivo del grupo de compra
-- ============================================================================

CREATE OR ALTER PROCEDURE Flt_sp_ListarGruposCompra
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        BuyingGroupID AS IdGrupoCompra,
        BuyingGroupName AS NombreGrupoCompra
    FROM Cli_GruposCompra
    ORDER BY BuyingGroupName ASC;
END
GO


-- ============================================================================
-- Stored Procedure: Flt_sp_ListarCategoriasProveedor
-- Descripción: Lista todas las categorías de proveedores disponibles
-- Uso: Se utiliza para cargar las opciones del filtro de categoría de proveedor
-- Tabla origen: Prov_CategoriasProveedor
-- Ordenamiento: Nombre de la categoría ascendente
-- Columnas retornadas:
--   - IdCategoriaProveedor: Identificador único de la categoría
--   - NombreCategoriaProveedor: Nombre descriptivo de la categoría
-- ============================================================================

CREATE OR ALTER PROCEDURE Flt_sp_ListarCategoriasProveedor
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        SupplierCategoryID AS IdCategoriaProveedor,
        SupplierCategoryName AS NombreCategoriaProveedor
    FROM Prov_CategoriasProveedor
    ORDER BY SupplierCategoryName;
END
GO


-- ============================================================================
-- Stored Procedure: Flt_sp_ListarGruposProductos
-- Descripción: Lista todos los grupos de productos disponibles
-- Uso: Se utiliza para cargar las opciones del filtro de grupo de producto
-- Tabla origen: Inv_GruposArticulo
-- Ordenamiento: Nombre del grupo ascendente
-- Columnas retornadas:
--   - IdGrupo: Identificador único del grupo de producto
--   - NombreGrupo: Nombre descriptivo del grupo de producto
-- ============================================================================

CREATE OR ALTER PROCEDURE Flt_sp_ListarGruposProductos
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        StockGroupID AS IdGrupo,
        StockGroupName AS NombreGrupo
    FROM Inv_GruposArticulo
    ORDER BY StockGroupName ASC;
END
GO

USE WideWorldImporters;
GO

-- ============================================================================
-- Stored Procedure: Flt_sp_ListarAniosVentas
-- Descripción: Lista los años distintos con registros de ventas
-- Uso: Se utiliza para cargar las opciones de año en reportes de ventas
-- Tabla origen: Vta_Facturas
-- Ordenamiento: Año ascendente
-- Columnas retornadas:
--   - Anio: Año de la factura
-- ============================================================================

CREATE OR ALTER PROCEDURE Flt_sp_ListarAniosVentas
AS
BEGIN
    SET NOCOUNT ON;

    SELECT DISTINCT
        YEAR(InvoiceDate) AS Anio
    FROM Vta_Facturas
    ORDER BY Anio ASC;
END
GO


-- ============================================================================
-- Stored Procedure: Flt_sp_ListarAniosCompras
-- Descripción: Lista los años distintos con registros de compras
-- Uso: Se utiliza para cargar las opciones de año en reportes de compras
-- Tabla origen: Cmp_OrdenesCompra
-- Ordenamiento: Año ascendente
-- Columnas retornadas:
--   - Anio: Año de la orden de compra
-- ============================================================================

CREATE OR ALTER PROCEDURE Flt_sp_ListarAniosCompras
AS
BEGIN
    SET NOCOUNT ON;

    SELECT DISTINCT
        YEAR(OrderDate) AS Anio
    FROM Cmp_OrdenesCompra
    ORDER BY Anio ASC;
END
GO


-- ============================================================================
-- Stored Procedure: Flt_sp_ListarCategoriasProducto
-- Descripción: Lista todas las categorías principales de productos
-- Uso: Se utiliza para cargar las opciones de categoría en reportes
-- Tabla origen: Inv_GruposArticulo
-- Ordenamiento: Nombre de la categoría ascendente
-- Columnas retornadas:
--   - IdCategoriaProducto: Identificador único de la categoría
--   - NombreCategoriaProducto: Nombre descriptivo de la categoría
-- ============================================================================

CREATE OR ALTER PROCEDURE Flt_sp_ListarCategoriasProducto
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        StockGroupID AS IdCategoriaProducto,
        StockGroupName AS NombreCategoriaProducto
    FROM Inv_GruposArticulo
    ORDER BY StockGroupName ASC;
END
GO


-- ============================================================================
-- Stored Procedure: Flt_sp_ListarSubcategoriasProducto
-- Descripción: Lista todas las subcategorías de productos
-- Uso: Se utiliza para cargar las opciones de subcategoría en reportes 7 y 8
-- Tabla origen: Inv_GruposArticulo
-- Ordenamiento: Nombre de la subcategoría ascendente
-- Columnas retornadas:
--   - IdSubcategoria: Identificador único de la subcategoría
--   - NombreSubcategoria: Nombre descriptivo de la subcategoría
-- ============================================================================

CREATE OR ALTER PROCEDURE Flt_sp_ListarSubcategoriasProducto
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        StockGroupID AS IdSubcategoria,
        StockGroupName AS NombreSubcategoria
    FROM Inv_GruposArticulo
    ORDER BY StockGroupName ASC;
END
GO


-- ============================================================================
-- Stored Procedure: Flt_sp_ListarProveedores
-- Descripción: Lista todos los proveedores disponibles en el sistema
-- Uso: Se utiliza para cargar las opciones de proveedor en reportes
-- Tabla origen: Prov_Proveedores
-- Ordenamiento: Nombre del proveedor ascendente
-- Columnas retornadas:
--   - IdProveedor: Identificador único del proveedor
--   - NombreProveedor: Nombre descriptivo del proveedor
-- ============================================================================

CREATE OR ALTER PROCEDURE Flt_sp_ListarProveedores
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        SupplierID AS IdProveedor,
        SupplierName AS NombreProveedor
    FROM Prov_Proveedores
    ORDER BY SupplierName ASC;
END
GO


-- ============================================================================
-- Stored Procedure: Flt_sp_ListarProductos
-- Descripción: Lista todos los productos disponibles en el sistema
-- Uso: Se utiliza para cargar las opciones de producto en formularios y reportes
-- Tabla origen: Inv_Articulos
-- Ordenamiento: Nombre del producto ascendente
-- Columnas retornadas:
--   - IdProducto: Identificador único del producto
--   - NombreProducto: Nombre descriptivo del producto
--   - PrecioUnitario: Precio unitario actual del producto
-- ============================================================================

CREATE OR ALTER PROCEDURE Flt_sp_ListarProductos
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        StockItemID AS IdProducto,
        StockItemName AS NombreProducto,
        UnitPrice AS PrecioUnitario
    FROM Inv_Articulos
    ORDER BY StockItemName ASC;
END
GO


-- ============================================================================
-- Stored Procedure: Flt_sp_ListarClientes
-- Descripción: Lista todos los clientes disponibles en el sistema
-- Uso: Se utiliza para cargar las opciones del filtro de cliente
-- Tabla origen: Cli_Clientes
-- Ordenamiento: Nombre del cliente ascendente
-- Columnas retornadas:
--   - IdCliente: Identificador único del cliente
--   - NombreCliente: Nombre descriptivo del cliente
-- ============================================================================

CREATE OR ALTER PROCEDURE Flt_sp_ListarClientes
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        CustomerID AS IdCliente,
        CustomerName AS NombreCliente
    FROM Cli_Clientes
    ORDER BY CustomerName;
END
GO
