USE WideWorldImporters;
GO

-- ============================================
-- SP: Insertar nuevo cliente
-- ============================================
CREATE OR ALTER PROCEDURE Cli_sp_InsertarCliente
    @NombreCliente        NVARCHAR(100),
    @CategoriaID          INT,
    @MetodoEntregaID      INT,
    @PrimaryContactID     INT,
    @DeliveryCityID       INT,
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
            30, @PhoneNumber, @PhoneNumber, 'http://www.pendiente.com',
            @DeliveryAddressLine1, @DeliveryPostalCode,
            @PostalAddressLine1, @PostalPostalCode, 1
        );

        SELECT @NuevoID = CustomerID FROM @IdsInsertados;

        UPDATE Cli_Clientes
        SET BillToCustomerID = @NuevoID
        WHERE CustomerID = @NuevoID;

        COMMIT TRANSACTION;
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
    @PhoneNumber          NVARCHAR(20)  = 'Sin definir',
    @DeliveryAddressLine1 NVARCHAR(60)  = 'Sin definir',
    @DeliveryPostalCode   NVARCHAR(10)  = '00000'
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Cli_Clientes WHERE CustomerID = @CustomerID)
        BEGIN
            RAISERROR('El cliente especificado no existe.', 16, 1);
            RETURN;
        END

        BEGIN TRANSACTION;

        UPDATE Cli_Clientes
        SET
            CustomerName          = @NombreCliente,
            CustomerCategoryID    = @CategoriaID,
            DeliveryMethodID      = @MetodoEntregaID,
            PhoneNumber           = @PhoneNumber,
            FaxNumber             = @PhoneNumber,
            DeliveryAddressLine1  = @DeliveryAddressLine1,
            DeliveryPostalCode    = @DeliveryPostalCode,
            LastEditedBy          = 1
        WHERE CustomerID = @CustomerID;

        COMMIT TRANSACTION;
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
        BEGIN
            RAISERROR('El cliente especificado no existe.', 16, 1);
            RETURN;
        END

        IF EXISTS (SELECT 1 FROM Vta_Facturas WHERE CustomerID = @CustomerID)
        BEGIN
            RAISERROR('No se puede eliminar: el cliente tiene facturas registradas.', 16, 1);
            RETURN;
        END

        BEGIN TRANSACTION;

        DELETE FROM Cli_Clientes WHERE CustomerID = @CustomerID;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO