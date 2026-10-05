USE WideWorldImporters;
GO

-- ============================================================================
-- 02_SP_Clientes.sql
-- Stored Procedures de Clientes - Proyecto 1 Bases de Datos 2
--
-- Descripción:
--   Contiene los procedimientos almacenados para la gestión de clientes,
--   incluyendo listado con filtros y detalle completo de un cliente específico.
-- ============================================================================

-- ============================================================================
-- Stored Procedure: Cli_sp_ListarClientes
-- Descripción: Lista clientes con filtros acumulativos opcionales
-- Uso: Consulta de clientes con filtros de búsqueda flexibles
-- Parámetros:
--   @Nombre: Filtro por nombre del cliente (búsqueda parcial, LIKE)
--   @CategoriaID: Filtro por categoría de cliente (exacto)
--   @MetodoEntregaID: Filtro por método de entrega (exacto)
-- Ordenamiento: Nombre del cliente ascendente
-- Columnas retornadas:
--   - IdCliente: Identificador único del cliente
--   - NombreCliente: Nombre del cliente
--   - CategoriaCliente: Categoría a la que pertenece el cliente
--   - MetodoEntrega: Método de entrega preferido
-- ============================================================================
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
    WHERE (@Nombre IS NULL OR C.CustomerName LIKE '%' + @Nombre + '%')
      AND (@CategoriaID IS NULL OR C.CustomerCategoryID = @CategoriaID)
      AND (@MetodoEntregaID IS NULL OR C.DeliveryMethodID = @MetodoEntregaID)
    ORDER BY C.CustomerName ASC;
END
GO


-- ============================================================================
-- Stored Procedure: Cli_sp_DetalleCliente
-- Descripción: Obtiene el detalle completo de un cliente específico
-- Uso: Cargar datos de un cliente para visualización o edición
-- Parámetros:
--   @CustomerID: Identificador único del cliente a consultar
-- Columnas retornadas:
--   - IdCliente: Identificador único del cliente
--   - NombreCliente: Nombre del cliente
--   - IdCategoria: Identificador de la categoría del cliente
--   - CategoriaCliente: Nombre de la categoría del cliente
--   - IdGrupoCompra: Identificador del grupo de compra
--   - GrupoCompra: Nombre del grupo de compra
--   - IdContactoPrimario: Identificador del contacto principal
--   - ContactoPrimario: Nombre del contacto principal
--   - ContactoAlternativo: Nombre del contacto alternativo
--   - IdClienteFacturar: Identificador del cliente al que facturar
--   - IdMetodoEntrega: Identificador del método de entrega
--   - MetodoEntrega: Nombre del método de entrega
--   - IdCiudadEntrega: Identificador de la ciudad de entrega
--   - CiudadEntrega: Nombre de la ciudad de entrega
--   - CodigoPostalEntrega: Código postal de entrega
--   - Telefono: Número de teléfono
--   - Fax: Número de fax
--   - DiasGraciaPago: Días de gracia para pago
--   - SitioWeb: URL del sitio web
--   - DireccionEntregaLinea1: Primera línea de dirección de entrega
--   - DireccionEntregaLinea2: Segunda línea de dirección de entrega
--   - DireccionPostalLinea1: Primera línea de dirección postal
--   - DireccionPostalLinea2: Segunda línea de dirección postal
--   - CodigoPostalPostal: Código postal postal
--   - UbicacionEntregaMapa: Coordenadas geográficas para mapa
-- ============================================================================
CREATE OR ALTER PROCEDURE Cli_sp_DetalleCliente
    @CustomerID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        C.CustomerID                   AS IdCliente,
        C.CustomerName                 AS NombreCliente,
        C.CustomerCategoryID           AS IdCategoria,
        CC.CustomerCategoryName        AS CategoriaCliente,
        C.BuyingGroupID                AS IdGrupoCompra,
        BG.BuyingGroupName             AS GrupoCompra,
        C.PrimaryContactPersonID       AS IdContactoPrimario,
        pContacto.FullName             AS ContactoPrimario,
        aContacto.FullName             AS ContactoAlternativo,
        C.BillToCustomerID             AS IdClienteFacturar,
        C.DeliveryMethodID             AS IdMetodoEntrega,
        DM.DeliveryMethodName          AS MetodoEntrega,
        C.DeliveryCityID               AS IdCiudadEntrega,
        CIU.CityName                   AS CiudadEntrega,
        C.DeliveryPostalCode           AS CodigoPostalEntrega,
        C.PhoneNumber                  AS Telefono,
        C.FaxNumber                    AS Fax,
        C.PaymentDays                  AS DiasGraciaPago,
        C.WebsiteURL                   AS SitioWeb,
        C.DeliveryAddressLine1         AS DireccionEntregaLinea1,
        C.DeliveryAddressLine2         AS DireccionEntregaLinea2,
        C.PostalAddressLine1           AS DireccionPostalLinea1,
        C.PostalAddressLine2           AS DireccionPostalLine2,
        C.PostalPostalCode             AS CodigoPostalPostal,
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
