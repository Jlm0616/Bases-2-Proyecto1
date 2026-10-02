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