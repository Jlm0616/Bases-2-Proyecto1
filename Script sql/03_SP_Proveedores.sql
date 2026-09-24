USE WideWorldImporters;
GO

-- ============================================
-- SP: Listar proveedores con filtros acumulativos
-- Filtros: nombre (texto libre), categoria (seleccion)
-- Orden por defecto: nombre del proveedor ascendente
-- ============================================
CREATE OR ALTER PROCEDURE Prov_sp_ListarProveedores
    @Nombre       NVARCHAR(100) = NULL,
    @CategoriaID  INT           = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        P.SupplierID              AS IdProveedor,
        P.SupplierName            AS NombreProveedor,
        PC.SupplierCategoryName   AS CategoriaProveedor,
        DM.DeliveryMethodName     AS MetodoEntrega
    FROM Prov_Proveedores AS P
    LEFT JOIN Prov_CategoriasProveedor AS PC ON PC.SupplierCategoryID = P.SupplierCategoryID
    LEFT JOIN Gen_MetodosEntrega       AS DM ON DM.DeliveryMethodID   = P.DeliveryMethodID
    WHERE (@Nombre      IS NULL OR P.SupplierName LIKE '%' + @Nombre + '%')
      AND (@CategoriaID IS NULL OR P.SupplierCategoryID = @CategoriaID)
    ORDER BY P.SupplierName ASC;
END
GO

-- ============================================
-- SP: Detalle de un proveedor específico
-- ============================================
CREATE OR ALTER PROCEDURE Prov_sp_DetalleProveedor
    @SupplierID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        P.SupplierID                     AS IdProveedor,
        P.SupplierReference              AS CodigoProveedor,
        P.SupplierName                   AS NombreProveedor,
        PC.SupplierCategoryName          AS CategoriaProveedor,
        pContacto.FullName               AS ContactoPrimario,
        aContacto.FullName               AS ContactoAlternativo,
        DM.DeliveryMethodName            AS MetodoEntrega,
        CIU.CityName                     AS CiudadEntrega,
        P.DeliveryPostalCode             AS CodigoPostalEntrega,
        P.PhoneNumber                    AS Telefono,
        P.FaxNumber                      AS Fax,
        P.WebsiteURL                     AS SitioWeb,
        P.DeliveryAddressLine1           AS DireccionEntregaLinea1,
        P.DeliveryAddressLine2           AS DireccionEntregaLinea2,
        P.PostalAddressLine1             AS DireccionPostalLinea1,
        P.PostalAddressLine2             AS DireccionPostalLinea2,
        P.DeliveryLocation.STAsText()    AS UbicacionEntregaMapa,
        P.BankAccountName                AS NombreBanco,
        P.BankAccountNumber              AS NumeroCuentaCorriente,
        P.PaymentDays                    AS DiasGraciaPago
    FROM Prov_Proveedores AS P
    LEFT JOIN Prov_CategoriasProveedor AS PC        ON PC.SupplierCategoryID = P.SupplierCategoryID
    LEFT JOIN Gen_MetodosEntrega       AS DM        ON DM.DeliveryMethodID   = P.DeliveryMethodID
    LEFT JOIN Gen_Ciudades             AS CIU       ON CIU.CityID            = P.DeliveryCityID
    LEFT JOIN Gen_Personas             AS pContacto ON pContacto.PersonID    = P.PrimaryContactPersonID
    LEFT JOIN Gen_Personas             AS aContacto ON aContacto.PersonID    = P.AlternateContactPersonID
    WHERE P.SupplierID = @SupplierID;
END
GO