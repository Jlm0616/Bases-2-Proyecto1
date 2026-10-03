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