USE WideWorldImporters;
GO

-- ============================================================================
-- Stored Procedure: Prov_sp_InsertarProveedor
-- Descripción: Inserta un nuevo proveedor en el sistema con valores predeterminados para campos opcionales
-- Uso: Se utiliza para registrar nuevos proveedores en el sistema, estableciendo relaciones con categorías y contactos
-- Parámetros:
--   - @NombreProveedor: Nombre del proveedor (obligatorio)
--   - @CategoriaID: Identificador de la categoría de proveedor (obligatorio)
--   - @PrimaryContactID: Identificador de la persona de contacto principal (obligatorio)
--   - @AlternateContactID: Identificador de la persona de contacto alternativo (obligatorio)
--   - @MetodoEntregaID: Identificador del método de entrega (opcional)
--   - @DeliveryCityID: Identificador de la ciudad de entrega (obligatorio)
--   - @LastEditedBy: Identificador de la persona que realiza la edición (obligatorio)
--   - @PostalCityID: Identificador de la ciudad postal (opcional, usa DeliveryCityID si es NULL)
--   - @PhoneNumber: Número de teléfono (opcional, default 'Sin definir')
--   - @DeliveryAddressLine1: Línea de dirección de entrega (opcional, default 'Sin definir')
--   - @DeliveryPostalCode: Código postal de entrega (opcional, default '00000')
--   - @PostalAddressLine1: Línea de dirección postal (opcional, default 'Sin definir')
--   - @PostalPostalCode: Código postal postal (opcional, default '00000')
--   - @NuevoID: Parámetro OUTPUT que retorna el ID del proveedor insertado
-- Tablas origen: Prov_Proveedores, Gen_Personas
-- Columnas retornadas:
--   - NuevoProveedorID: Identificador del proveedor recién insertado
--   - Resultado: 'OK' si la operación fue exitosa
-- ============================================================================

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


-- ============================================================================
-- Stored Procedure: Prov_sp_ActualizarProveedor
-- Descripción: Actualiza los datos de un proveedor existente, permitiendo modificar solo los campos proporcionados
-- Uso: Se utiliza para modificar la información de proveedores registrados, manteniendo los valores existentes para parámetros NULL
-- Parámetros:
--   - @SupplierID: Identificador del proveedor a actualizar (obligatorio)
--   - @NombreProveedor: Nuevo nombre del proveedor (obligatorio)
--   - @CategoriaID: Nuevo identificador de categoría de proveedor (obligatorio)
--   - @MetodoEntregaID: Nuevo identificador de método de entrega (obligatorio)
--   - @LastEditedBy: Identificador de la persona que realiza la edición (obligatorio)
--   - @PrimaryContactID: Nuevo identificador de contacto principal (opcional, mantiene valor actual si es NULL)
--   - @AlternateContactID: Nuevo identificador de contacto alternativo (opcional, mantiene valor actual si es NULL)
--   - @DeliveryCityID: Nuevo identificador de ciudad de entrega (opcional, mantiene valor actual si es NULL)
--   - @PostalCityID: Nuevo identificador de ciudad postal (opcional, mantiene valor actual si es NULL)
--   - @PhoneNumber: Nuevo número de teléfono (opcional, default 'Sin definir')
--   - @DeliveryAddressLine1: Nueva línea de dirección de entrega (opcional, default 'Sin definir')
--   - @DeliveryPostalCode: Nuevo código postal de entrega (opcional, default '00000')
--   - @PostalAddressLine1: Nueva línea de dirección postal (opcional, default 'Sin definir')
--   - @PostalPostalCode: Nuevo código postal postal (opcional, default '00000')
-- Tablas origen: Prov_Proveedores, Gen_Personas
-- Columnas retornadas:
--   - FilasAfectadas: Cantidad de filas actualizadas (debe ser 1)
--   - Resultado: 'OK' si la operación fue exitosa
-- ============================================================================

CREATE OR ALTER PROCEDURE Prov_sp_ActualizarProveedor
    @SupplierID           INT,
    @NombreProveedor      NVARCHAR(100),
    @CategoriaID          INT,
    @MetodoEntregaID      INT,
    @LastEditedBy         INT,
    @PrimaryContactID     INT             = NULL,
    @AlternateContactID   INT             = NULL,
    @DeliveryCityID       INT             = NULL,
    @PostalCityID         INT             = NULL,
    @PhoneNumber          NVARCHAR(20)    = 'Sin definir',
    @DeliveryAddressLine1 NVARCHAR(60)    = 'Sin definir',
    @DeliveryPostalCode   NVARCHAR(10)    = '00000',
    @PostalAddressLine1   NVARCHAR(60)    = 'Sin definir',
    @PostalPostalCode     NVARCHAR(10)    = '00000'
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
            SupplierName             = @NombreProveedor,
            SupplierCategoryID       = @CategoriaID,
            DeliveryMethodID         = @MetodoEntregaID,
            PrimaryContactPersonID   = ISNULL(@PrimaryContactID, PrimaryContactPersonID),
            AlternateContactPersonID = ISNULL(@AlternateContactID, AlternateContactPersonID),
            DeliveryCityID           = ISNULL(@DeliveryCityID, DeliveryCityID),
            PostalCityID             = ISNULL(@PostalCityID, PostalCityID),
            PhoneNumber              = @PhoneNumber,
            FaxNumber                = @PhoneNumber,
            DeliveryAddressLine1     = @DeliveryAddressLine1,
            DeliveryPostalCode       = @DeliveryPostalCode,
            PostalAddressLine1       = @PostalAddressLine1,
            PostalPostalCode         = @PostalPostalCode,
            LastEditedBy             = @LastEditedBy
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


-- ============================================================================
-- Stored Procedure: Prov_sp_EliminarProveedor
-- Descripción: Elimina un proveedor del sistema, verificando previamente que no tenga órdenes de compra registradas
-- Uso: Se utiliza para eliminar proveedores que no tienen historial de compras, garantizando integridad referencial
-- Parámetros:
--   - @SupplierID: Identificador del proveedor a eliminar (obligatorio)
-- Tablas origen: Prov_Proveedores, Cmp_OrdenesCompra
-- Columnas retornadas:
--   - FilasAfectadas: Cantidad de filas eliminadas (debe ser 1)
--   - Resultado: 'OK' si la operación fue exitosa
-- Notas: Arroja error si el proveedor tiene órdenes de compra registradas para mantener integridad referencial
-- ============================================================================

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