USE WideWorldImporters;
GO

-- ============================================
-- SP: Listar clientes con filtros acumulativos
-- Filtros: nombre (texto libre), categoria, metodo de entrega
-- Orden por defecto: nombre del cliente ascendente
-- ============================================

CREATE OR ALTER PROCEDURE Cli_sp_ListarClientes
    @Nombre               NVARCHAR(100) = NULL,
    @CategoriaID          INT = NULL,
    @MetodoEntregaID      INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        C.CustomerID              AS IdCliente,
        C.CustomerName            AS NombreCliente,
        CC.CustomerCategoryName   AS CategoriaCliente,
        DM.DeliveryMethodName     AS MetodoEntrega
    FROM Cli_Clientes AS C
    LEFT JOIN Cli_CategoriasCliente AS CC ON CC.CustomerCategoryID = C.CustomerCategoryID
    LEFT JOIN Gen_MetodosEntrega    AS DM ON DM.DeliveryMethodID   = C.DeliveryMethodID
    WHERE (
        @Nombre IS NULL OR C.CustomerName LIKE '%' + @Nombre + '%')
        AND (@CategoriaID IS NULL OR C.CustomerCategoryID = @CategoriaID)
        AND (@MetodoEntregaID IS NULL OR C.DeliveryMethodID = @MetodoEntregaID)
    ORDER BY C.CustomerName ASC;
END
GO

-- ============================================
-- SP: Detalle de un cliente especifico
-- ============================================
CREATE OR ALTER PROCEDURE Cli_sp_DetalleCliente
    @CustomerID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        C.CustomerID                   AS IdCliente,
        C.CustomerName                 AS NombreCliente,
        CC.CustomerCategoryName        AS CategoriaCliente,
        BG.BuyingGroupName             AS GrupoCompra,
        pContacto.FullName             AS ContactoPrimario,
        aContacto.FullName             AS ContactoAlternativo,
        C.BillToCustomerID             AS IdClienteFacturar,
        DM.DeliveryMethodName          AS MetodoEntrega,
        CIU.CityName                   AS CiudadEntrega,
        C.DeliveryPostalCode           AS CodigoPostalEntrega,
        C.PhoneNumber                  AS Telefono,
        C.FaxNumber                    AS Fax,
        C.PaymentDays                  AS DiasGraciaPago,
        C.WebsiteURL                   AS SitioWeb,
        C.DeliveryAddressLine1         AS DireccionEntregaLinea1,
        C.DeliveryAddressLine2         AS DireccionEntregaLinea2,
        C.PostalAddressLine1           AS DireccionPostalLinea1,
        C.PostalAddressLine2           AS DireccionPostalLinea2,
        C.DeliveryLocation.STAsText()  AS UbicacionEntregaMapa
    FROM Cli_Clientes AS C
    LEFT JOIN Cli_CategoriasCliente AS CC ON CC.CustomerCategoryID = C.CustomerCategoryID
    LEFT JOIN Cli_GruposCompra      AS BG ON BG.BuyingGroupID = C.BuyingGroupID
    LEFT JOIN Gen_MetodosEntrega    AS DM ON DM.DeliveryMethodID = C.DeliveryMethodID
    LEFT JOIN Gen_Ciudades          AS CIU ON CIU.CityID = C.DeliveryCityID
    LEFT JOIN Gen_Personas          AS pContacto ON pContacto.PersonID = C.PrimaryContactPersonID
    LEFT JOIN Gen_Personas          AS aContacto ON aContacto.PersonID = C.AlternateContactPersonID
    WHERE C.CustomerID = @CustomerID;
END
GO