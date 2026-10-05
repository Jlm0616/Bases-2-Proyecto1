USE WideWorldImporters;
GO

-- ============================================================================
-- Stored Procedure: Cli_sp_InsertarCliente
-- Descripción: Inserta un nuevo cliente en el sistema, configurando la auto-facturación (el cliente se factura a sí mismo)
-- Uso: Se utiliza para registrar nuevos clientes en el sistema, con valores predeterminados para campos opcionales
-- Parámetros:
--   - @NombreCliente: Nombre del cliente (obligatorio)
--   - @CategoriaID: Identificador de la categoría de cliente (obligatorio)
--   - @MetodoEntregaID: Identificador del método de entrega (obligatorio)
--   - @PrimaryContactID: Identificador de la persona de contacto principal (obligatorio)
--   - @DeliveryCityID: Identificador de la ciudad de entrega (obligatorio)
--   - @LastEditedBy: Identificador de la persona que realiza la edición (obligatorio)
--   - @PostalCityID: Identificador de la ciudad postal (opcional, usa DeliveryCityID si es NULL)
--   - @BuyingGroupID: Identificador del grupo de compra (opcional)
--   - @PhoneNumber: Número de teléfono (opcional, default 'Sin definir')
--   - @DeliveryAddressLine1: Línea de dirección de entrega (opcional, default 'Sin definir')
--   - @DeliveryPostalCode: Código postal de entrega (opcional, default '00000')
--   - @PostalAddressLine1: Línea de dirección postal (opcional, default 'Sin definir')
--   - @PostalPostalCode: Código postal postal (opcional, default '00000')
--   - @NuevoID: Parámetro OUTPUT que retorna el ID del cliente insertado
-- Tablas origen: Cli_Clientes, Gen_Personas
-- Columnas retornadas:
--   - NuevoClienteID: Identificador del cliente recién insertado
--   - Resultado: 'OK' si la operación fue exitosa
-- ============================================================================

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


-- ============================================================================
-- Stored Procedure: Cli_sp_ActualizarCliente
-- Descripción: Actualiza los datos de un cliente existente, permitiendo modificar solo los campos proporcionados
-- Uso: Se utiliza para modificar la información de clientes registrados, manteniendo los valores existentes para parámetros NULL
-- Parámetros:
--   - @CustomerID: Identificador del cliente a actualizar (obligatorio)
--   - @NombreCliente: Nuevo nombre del cliente (obligatorio)
--   - @CategoriaID: Nuevo identificador de categoría de cliente (obligatorio)
--   - @MetodoEntregaID: Nuevo identificador de método de entrega (obligatorio)
--   - @LastEditedBy: Identificador de la persona que realiza la edición (obligatorio)
--   - @PrimaryContactID: Nuevo identificador de contacto principal (opcional, mantiene valor actual si es NULL)
--   - @DeliveryCityID: Nuevo identificador de ciudad de entrega (opcional, mantiene valor actual si es NULL)
--   - @PostalCityID: Nuevo identificador de ciudad postal (opcional, mantiene valor actual si es NULL)
--   - @BuyingGroupID: Nuevo identificador de grupo de compra (opcional, mantiene valor actual si es NULL)
--   - @PhoneNumber: Nuevo número de teléfono (opcional, default 'Sin definir')
--   - @DeliveryAddressLine1: Nueva línea de dirección de entrega (opcional, default 'Sin definir')
--   - @DeliveryPostalCode: Nuevo código postal de entrega (opcional, default '00000')
--   - @PostalAddressLine1: Nueva línea de dirección postal (opcional, default 'Sin definir')
--   - @PostalPostalCode: Nuevo código postal postal (opcional, default '00000')
-- Tablas origen: Cli_Clientes, Gen_Personas
-- Columnas retornadas:
--   - FilasAfectadas: Cantidad de filas actualizadas (debe ser 1)
--   - Resultado: 'OK' si la operación fue exitosa
-- ============================================================================

CREATE OR ALTER PROCEDURE Cli_sp_ActualizarCliente
    @CustomerID           INT,
    @NombreCliente        NVARCHAR(100),
    @CategoriaID          INT,
    @MetodoEntregaID      INT,
    @LastEditedBy         INT,
    @PrimaryContactID     INT             = NULL,
    @DeliveryCityID       INT             = NULL,
    @PostalCityID         INT             = NULL,
    @BuyingGroupID        INT             = NULL,
    @PhoneNumber          NVARCHAR(20)    = 'Sin definir',
    @DeliveryAddressLine1 NVARCHAR(60)    = 'Sin definir',
    @DeliveryPostalCode   NVARCHAR(10)    = '00000',
    @PostalAddressLine1   NVARCHAR(60)    = 'Sin definir',
    @PostalPostalCode     NVARCHAR(10)    = '00000'
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
            PrimaryContactPersonID = ISNULL(@PrimaryContactID, PrimaryContactPersonID),
            DeliveryCityID        = ISNULL(@DeliveryCityID, DeliveryCityID),
            PostalCityID          = ISNULL(@PostalCityID, PostalCityID),
            BuyingGroupID         = ISNULL(@BuyingGroupID, BuyingGroupID),
            PhoneNumber           = @PhoneNumber,
            FaxNumber             = @PhoneNumber,
            DeliveryAddressLine1  = @DeliveryAddressLine1,
            DeliveryPostalCode    = @DeliveryPostalCode,
            PostalAddressLine1    = @PostalAddressLine1,
            PostalPostalCode      = @PostalPostalCode,
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


-- ============================================================================
-- Stored Procedure: Cli_sp_EliminarCliente
-- Descripción: Elimina un cliente del sistema, verificando previamente que no tenga facturas registradas
-- Uso: Se utiliza para eliminar clientes que no tienen historial de ventas, garantizando integridad referencial
-- Parámetros:
--   - @CustomerID: Identificador del cliente a eliminar (obligatorio)
-- Tablas origen: Cli_Clientes, Vta_Facturas
-- Columnas retornadas:
--   - FilasAfectadas: Cantidad de filas eliminadas (debe ser 1)
--   - Resultado: 'OK' si la operación fue exitosa
-- Notas: Arroja error si el cliente tiene facturas registradas para mantener integridad referencial
-- ============================================================================

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