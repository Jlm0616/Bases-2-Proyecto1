USE WideWorldImporters;
GO

-- ============================================
-- 07b - CRUD Proveedores
-- Procedimientos:
--   Prov_sp_InsertarProveedor
--   Prov_sp_ActualizarProveedor
--   Prov_sp_EliminarProveedor
-- Dependencias: Gen_Personas, Cmp_OrdenesCompra
-- ============================================

-- ============================================
-- SP: Insertar nuevo proveedor
-- ============================================
CREATE OR ALTER PROCEDURE Prov_sp_InsertarProveedor
    @NombreProveedor      NVARCHAR(100),
    @CategoriaID          INT,
    @PrimaryContactID     INT,
    @AlternateContactID   INT,
    @MetodoEntregaID      INT           = NULL,
    @DeliveryCityID       INT,
    @LastEditedBy         INT,
    @PostalCityID         INT           = NULL,
    @PhoneNumber          NVARCHAR(20)  = 'Sin definir',
    @DeliveryAddressLine1 NVARCHAR(60)  = 'Sin definir',
    @DeliveryPostalCode   NVARCHAR(10)  = '00000',
    @PostalAddressLine1   NVARCHAR(60)  = 'Sin definir',
    @PostalPostalCode     NVARCHAR(10)  = '00000',
    @NuevoID              INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Gen_Personas WHERE PersonID = @LastEditedBy)
            THROW 50002, 'El LastEditedBy (PersonID) especificado no existe.', 1;

        BEGIN TRANSACTION;

        SET @PostalCityID = ISNULL(@PostalCityID, @DeliveryCityID);

        DECLARE @IdsInsertados TABLE (SupplierID INT);

        INSERT INTO Prov_Proveedores (
            SupplierName, SupplierCategoryID, PrimaryContactPersonID,
            AlternateContactPersonID, DeliveryMethodID, DeliveryCityID, PostalCityID,
            PaymentDays, PhoneNumber, FaxNumber, WebsiteURL,
            DeliveryAddressLine1, DeliveryPostalCode,
            PostalAddressLine1, PostalPostalCode, LastEditedBy
        )
        OUTPUT INSERTED.SupplierID INTO @IdsInsertados
        VALUES (
            @NombreProveedor, @CategoriaID, @PrimaryContactID,
            @AlternateContactID, @MetodoEntregaID, @DeliveryCityID, @PostalCityID,
            30, @PhoneNumber, @PhoneNumber, 'http://www.pendiente.com',
            @DeliveryAddressLine1, @DeliveryPostalCode,
            @PostalAddressLine1, @PostalPostalCode, @LastEditedBy
        );

        SELECT @NuevoID = SupplierID FROM @IdsInsertados;

        COMMIT TRANSACTION;

        SELECT @NuevoID AS NuevoProveedorID, 'OK' AS Resultado;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- ============================================
-- SP: Actualizar proveedor existente
-- ============================================
CREATE OR ALTER PROCEDURE Prov_sp_ActualizarProveedor
    @SupplierID           INT,
    @NombreProveedor      NVARCHAR(100),
    @CategoriaID          INT,
    @MetodoEntregaID      INT,
    @LastEditedBy         INT,
    @PhoneNumber          NVARCHAR(20)  = 'Sin definir',
    @DeliveryAddressLine1 NVARCHAR(60)  = 'Sin definir',
    @DeliveryPostalCode   NVARCHAR(10)  = '00000'
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Prov_Proveedores WHERE SupplierID = @SupplierID)
            THROW 50003, 'El proveedor especificado no existe.', 1;

        IF NOT EXISTS (SELECT 1 FROM Gen_Personas WHERE PersonID = @LastEditedBy)
            THROW 50002, 'El LastEditedBy (PersonID) especificado no existe.', 1;

        BEGIN TRANSACTION;

        DECLARE @Actualizados TABLE (SupplierID INT);

        UPDATE Prov_Proveedores
        SET
            SupplierName          = @NombreProveedor,
            SupplierCategoryID    = @CategoriaID,
            DeliveryMethodID      = @MetodoEntregaID,
            PhoneNumber           = @PhoneNumber,
            FaxNumber             = @PhoneNumber,
            DeliveryAddressLine1  = @DeliveryAddressLine1,
            DeliveryPostalCode    = @DeliveryPostalCode,
            LastEditedBy          = @LastEditedBy
        OUTPUT INSERTED.SupplierID INTO @Actualizados
        WHERE SupplierID = @SupplierID;

        COMMIT TRANSACTION;

        SELECT COUNT(*) AS FilasAfectadas, 'OK' AS Resultado FROM @Actualizados;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- ============================================
-- SP: Eliminar proveedor
-- ============================================
CREATE OR ALTER PROCEDURE Prov_sp_EliminarProveedor
    @SupplierID INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Prov_Proveedores WHERE SupplierID = @SupplierID)
            THROW 50003, 'El proveedor especificado no existe.', 1;

        IF EXISTS (SELECT 1 FROM Cmp_OrdenesCompra WHERE SupplierID = @SupplierID)
            THROW 50004, 'No se puede eliminar: el proveedor tiene ordenes de compra registradas.', 1;

        BEGIN TRANSACTION;

        DECLARE @Eliminados TABLE (SupplierID INT);

        DELETE FROM Prov_Proveedores
        OUTPUT DELETED.SupplierID INTO @Eliminados
        WHERE SupplierID = @SupplierID;

        COMMIT TRANSACTION;

        SELECT COUNT(*) AS FilasAfectadas, 'OK' AS Resultado FROM @Eliminados;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO