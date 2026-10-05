USE WideWorldImporters;
GO

-- ============================================
-- SP: Listar categorias de clientes
-- Uso: cargar opciones del filtro de categoria
-- Orden por defecto: nombre de la categoria ascendente
-- ============================================

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


-- ============================================
-- SP: Listar metodos de entrega
-- Uso: cargar opciones del filtro de metodo de entrega
-- Orden por defecto: nombre del metodo ascendente
-- ============================================

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

-- ============================================
-- SP: Listar personas
-- Uso: cargar opciones de contactos y usuarios
-- Orden por defecto: nombre de la persona ascendente
-- ============================================

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


-- ============================================
-- SP: Listar ciudades
-- Uso: cargar opciones de ciudad de entrega y ciudad postal
-- Orden por defecto: nombre de la ciudad ascendente
-- ============================================

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


-- ============================================
-- SP: Listar grupos de compra
-- Uso: cargar opciones de grupo de compra del cliente
-- Orden por defecto: nombre del grupo ascendente
-- ============================================

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

-- ============================================
-- SP: Listar categorias de proveedores
-- Uso: cargar opciones del filtro de categoria de proveedor
-- Orden por defecto: nombre de la categoria ascendente
-- ============================================

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


-- ============================================
-- SP: Listar grupos de productos
-- Uso: cargar opciones del filtro de grupo de producto
-- Orden por defecto: nombre del grupo ascendente
-- ============================================

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

-- ============================================
-- SP: Listar años disponibles en ventas
-- Uso: cargar opciones de año en reportes de ventas
-- Orden por defecto: año ascendente
-- ============================================

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


-- ============================================
-- SP: Listar años disponibles en compras
-- Uso: cargar opciones de año en reportes de compras
-- Orden por defecto: año ascendente
-- ============================================

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


-- ============================================
-- SP: Listar categorias principales de productos
-- Uso: cargar opciones de categoria
-- en reportes
-- ============================================

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


-- ============================================
-- SP: Listar subcategorias de productos
-- Uso: cargar opciones de subcategoria
-- para los reportes 7 y 8
-- ============================================

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


-- ============================================
-- SP: Listar proveedores
-- Uso: cargar opciones de proveedor en reportes
-- Orden por defecto: nombre del proveedor ascendente
-- ============================================

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


-- ============================================
-- SP: Listar productos
-- Uso: cargar opciones de producto en formularios y reportes
-- Incluye el precio unitario actual del producto
-- Orden por defecto: nombre del producto ascendente
-- ============================================

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


-- ============================================
-- SP: Listar clientes
-- Uso: cargar opciones del filtro de cliente
-- Orden por defecto: nombre del cliente ascendente
-- ============================================

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