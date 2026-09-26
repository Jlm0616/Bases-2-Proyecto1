USE WideWorldImporters;
GO

-- ============================================
-- SP: Insertar nuevo cliente
-- (patrón: INSERT con BillToCustomerID temporal válido,
--  luego UPDATE para que el cliente se facture a sí mismo)
-- ============================================
CREATE OR ALTER PROCEDURE Cli_sp_InsertarCliente
    @NombreCliente        NVARCHAR(100),
    @CategoriaID          INT,
    @MetodoEntregaID      INT,
    @PrimaryContactID     INT,
    @DeliveryCityID       INT,
    @LastEditedBy         INT,
    @PostalCityID         INT           = NULL,
    @BuyingGroupID        INT           = NULL,
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
        -- Validar auditoría (evita error FK contra Application.People)
        IF NOT EXISTS (SELECT 1 FROM Gen_Personas WHERE PersonID = @LastEditedBy)
            THROW 50002, 'El LastEditedBy (PersonID) especificado no existe.', 1;

        BEGIN TRANSACTION;

        SET @PostalCityID = ISNULL(@PostalCityID, @DeliveryCityID);

        DECLARE @IdsInsertados TABLE (CustomerID INT);

        INSERT INTO Cli_Clientes (
            CustomerName, BillToCustomerID, CustomerCategoryID,
            BuyingGroupID, PrimaryContactPersonID, DeliveryMethodID,
            DeliveryCityID, PostalCityID, AccountOpenedDate,
            StandardDiscountPercentage, IsStatementSent, IsOnCreditHold,
            PaymentDays, PhoneNumber, FaxNumber, WebsiteURL,
            DeliveryAddressLine1, DeliveryPostalCode,
            PostalAddressLine1, PostalPostalCode, LastEditedBy
        )
        OUTPUT INSERTED.CustomerID INTO @IdsInsertados
        VALUES (
            @NombreCliente, 1, @CategoriaID,
            @BuyingGroupID, @PrimaryContactID, @MetodoEntregaID,
            @DeliveryCityID, @PostalCityID, CAST(GETDATE() AS DATE),
            0, 0, 0,
            30, @PhoneNumber, @PhoneNumber, 'http://www.AunNoSe.com',
            @DeliveryAddressLine1, @DeliveryPostalCode,
            @PostalAddressLine1, @PostalPostalCode, @LastEditedBy
        );

        SELECT @NuevoID = CustomerID FROM @IdsInsertados;

        -- Auto-facturación: el cliente se factura a sí mismo
        UPDATE Cli_Clientes
        SET BillToCustomerID = @NuevoID
        WHERE CustomerID = @NuevoID;

        COMMIT TRANSACTION;

        SELECT @NuevoID AS NuevoClienteID, 'OK' AS Resultado;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO


-- ============================================
-- SP: Actualizar cliente existente
-- ============================================
CREATE OR ALTER PROCEDURE Cli_sp_ActualizarCliente
    @CustomerID           INT,
    @NombreCliente        NVARCHAR(100),
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
        IF NOT EXISTS (SELECT 1 FROM Cli_Clientes WHERE CustomerID = @CustomerID)
            THROW 50003, 'El cliente especificado no existe.', 1;

        IF NOT EXISTS (SELECT 1 FROM Gen_Personas WHERE PersonID = @LastEditedBy)
            THROW 50002, 'El LastEditedBy (PersonID) especificado no existe.', 1;

        BEGIN TRANSACTION;

        DECLARE @Actualizados TABLE (CustomerID INT);

        UPDATE Cli_Clientes
        SET
            CustomerName          = @NombreCliente,
            CustomerCategoryID    = @CategoriaID,
            DeliveryMethodID      = @MetodoEntregaID,
            PhoneNumber           = @PhoneNumber,
            FaxNumber             = @PhoneNumber,
            DeliveryAddressLine1  = @DeliveryAddressLine1,
            DeliveryPostalCode    = @DeliveryPostalCode,
            LastEditedBy          = @LastEditedBy
        OUTPUT INSERTED.CustomerID INTO @Actualizados
        WHERE CustomerID = @CustomerID;

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
-- SP: Eliminar cliente
-- ============================================
CREATE OR ALTER PROCEDURE Cli_sp_EliminarCliente
    @CustomerID INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Cli_Clientes WHERE CustomerID = @CustomerID)
            THROW 50003, 'El cliente especificado no existe.', 1;

        IF EXISTS (SELECT 1 FROM Vta_Facturas WHERE CustomerID = @CustomerID)
            THROW 50004, 'No se puede eliminar: el cliente tiene facturas registradas.', 1;

        BEGIN TRANSACTION;

        DECLARE @Eliminados TABLE (CustomerID INT);

        DELETE FROM Cli_Clientes
        OUTPUT DELETED.CustomerID INTO @Eliminados
        WHERE CustomerID = @CustomerID;

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