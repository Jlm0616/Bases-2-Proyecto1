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
        CC.CustomerCategoryID     AS IdCategoria,
        CC.CustomerCategoryName   AS NombreCategoria
    FROM Cli_CategoriasCliente AS CC
    ORDER BY CC.CustomerCategoryName ASC;
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
        DM.DeliveryMethodID       AS IdMetodoEntrega,
        DM.DeliveryMethodName     AS NombreMetodoEntrega
    FROM Gen_MetodosEntrega AS DM
    ORDER BY DM.DeliveryMethodName ASC;
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
        P.PersonID    AS IdPersona,
        P.FullName    AS NombrePersona
    FROM Gen_Personas AS P
    ORDER BY P.FullName ASC;
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
        C.CityID      AS IdCiudad,
        C.CityName    AS NombreCiudad
    FROM Gen_Ciudades AS C
    ORDER BY C.CityName ASC;
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
        G.BuyingGroupID      AS IdGrupoCompra,
        G.BuyingGroupName    AS NombreGrupoCompra
    FROM Cli_GruposCompra AS G
    ORDER BY G.BuyingGroupName ASC;
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
        PC.SupplierCategoryID     AS IdCategoria,
        PC.SupplierCategoryName   AS NombreCategoria
    FROM Prov_CategoriasProveedor AS PC
    ORDER BY PC.SupplierCategoryName ASC;
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
        SG.StockGroupID      AS IdGrupo,
        SG.StockGroupName    AS NombreGrupo
    FROM Inv_GruposArticulo AS SG
    ORDER BY SG.StockGroupName ASC;
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
        YEAR(I.InvoiceDate) AS Anio
    FROM Vta_Facturas AS I
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
        YEAR(PO.OrderDate) AS Anio
    FROM Cmp_OrdenesCompra AS PO
    ORDER BY Anio ASC;
END
GO


-- ============================================
-- SP: Listar categorias o grupos de productos
-- Uso: cargar opciones de categoria de producto
-- Orden por defecto: nombre del grupo ascendente
-- ============================================

CREATE OR ALTER PROCEDURE Flt_sp_ListarCategoriasProducto
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        SG.StockGroupID     AS IdCategoriaProducto,
        SG.StockGroupName   AS NombreCategoriaProducto
    FROM Inv_GruposArticulo AS SG
    ORDER BY SG.StockGroupName ASC;
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
        S.SupplierID     AS IdProveedor,
        S.SupplierName   AS NombreProveedor
    FROM Prov_Proveedores AS S
    ORDER BY S.SupplierName ASC;
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
        SI.StockItemID     AS IdProducto,
        SI.StockItemName   AS NombreProducto,
        SI.UnitPrice       AS PrecioUnitario
    FROM Inv_Articulos AS SI
    ORDER BY SI.StockItemName ASC;
END
GO