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


USE WideWorldImporters;
GO

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

-- ============================================
-- SP: Insertar nuevo producto
-- ============================================
CREATE OR ALTER PROCEDURE Inv_sp_InsertarProducto
    @NombreProducto     NVARCHAR(100),
    @SupplierID         INT,
    @UnitPackageID      INT,
    @OuterPackageID     INT,
    @LastEditedBy       INT,
    @ColorID            INT             = NULL,
    @Marca              NVARCHAR(50)    = NULL,
    @Talla              NVARCHAR(20)    = NULL,
    @LeadTimeDays       INT             = 7,
    @QuantityPerOuter   INT             = 1,
    @IsChillerStock     BIT             = 0,
    @TaxRate            DECIMAL(18,3)   = 15.000,
    @UnitPrice          DECIMAL(18,2)   = 0,
    @PrecioVenta        DECIMAL(18,2)   = NULL,
    @Peso               DECIMAL(18,3)   = 0.000,
    @NuevoID            INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Prov_Proveedores WHERE SupplierID = @SupplierID)
            THROW 50001, 'El proveedor especificado no existe.', 1;

        IF NOT EXISTS (SELECT 1 FROM Gen_Personas WHERE PersonID = @LastEditedBy)
            THROW 50002, 'El LastEditedBy (PersonID) especificado no existe.', 1;

        BEGIN TRANSACTION;

        DECLARE @IdsInsertados TABLE (StockItemID INT);

        INSERT INTO Inv_Articulos (
            StockItemName, SupplierID, ColorID, UnitPackageID, OuterPackageID,
            Brand, Size, LeadTimeDays, QuantityPerOuter, IsChillerStock,
            TaxRate, UnitPrice, RecommendedRetailPrice, TypicalWeightPerUnit,
            LastEditedBy
        )
        OUTPUT INSERTED.StockItemID INTO @IdsInsertados
        VALUES (
            @NombreProducto, @SupplierID, @ColorID, @UnitPackageID, @OuterPackageID,
            @Marca, @Talla, @LeadTimeDays, @QuantityPerOuter, @IsChillerStock,
            @TaxRate, @UnitPrice, @PrecioVenta, @Peso,
            @LastEditedBy
        );

        SELECT @NuevoID = StockItemID FROM @IdsInsertados;

        INSERT INTO Inv_ExistenciasArticulo (
            StockItemID, QuantityOnHand, BinLocation,
            LastStocktakeQuantity, LastCostPrice, ReorderLevel, TargetStockLevel,
            LastEditedBy, LastEditedWhen
        )
        VALUES (
            @NuevoID, 0, 'Sin asignar',
            0, @UnitPrice, 10, 50,
            @LastEditedBy, GETDATE()
        );

        COMMIT TRANSACTION;

        SELECT @NuevoID AS NuevoProductoID, 'OK' AS Resultado;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- ============================================
-- SP: Actualizar producto existente
-- ============================================
CREATE OR ALTER PROCEDURE Inv_sp_ActualizarProducto
    @StockItemID    INT,
    @NombreProducto NVARCHAR(100),
    @SupplierID     INT,
    @UnitPrice      DECIMAL(18,2),
    @PrecioVenta    DECIMAL(18,2)   = NULL,
    @TaxRate        DECIMAL(18,3)   = 15.000,
    @LastEditedBy   INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Inv_Articulos WHERE StockItemID = @StockItemID)
            THROW 50003, 'El producto especificado no existe.', 1;

        IF NOT EXISTS (SELECT 1 FROM Prov_Proveedores WHERE SupplierID = @SupplierID)
            THROW 50001, 'El proveedor especificado no existe.', 1;

        IF NOT EXISTS (SELECT 1 FROM Gen_Personas WHERE PersonID = @LastEditedBy)
            THROW 50002, 'El LastEditedBy (PersonID) especificado no existe.', 1;

        BEGIN TRANSACTION;

        DECLARE @Actualizados TABLE (StockItemID INT);

        UPDATE Inv_Articulos
        SET
            StockItemName           = @NombreProducto,
            SupplierID              = @SupplierID,
            UnitPrice               = @UnitPrice,
            RecommendedRetailPrice  = @PrecioVenta,
            TaxRate                 = @TaxRate,
            LastEditedBy            = @LastEditedBy
        OUTPUT INSERTED.StockItemID INTO @Actualizados
        WHERE StockItemID = @StockItemID;

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
-- SP: Eliminar producto
-- ============================================
CREATE OR ALTER PROCEDURE Inv_sp_EliminarProducto
    @StockItemID INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Inv_Articulos WHERE StockItemID = @StockItemID)
            THROW 50003, 'El producto especificado no existe.', 1;

        IF EXISTS (SELECT 1 FROM Vta_LineasFactura WHERE StockItemID = @StockItemID)
            THROW 50004, 'No se puede eliminar: el producto tiene ventas registradas.', 1;

        IF EXISTS (SELECT 1 FROM Cmp_LineasOrdenCompra WHERE StockItemID = @StockItemID)
            THROW 50005, 'No se puede eliminar: el producto tiene ordenes de compra registradas.', 1;

        BEGIN TRANSACTION;

        -- Primero elimina el registro de inventario (FK dependiente)
        DELETE FROM Inv_ExistenciasArticulo WHERE StockItemID = @StockItemID;

        DECLARE @Eliminados TABLE (StockItemID INT);

        DELETE FROM Inv_Articulos
        OUTPUT DELETED.StockItemID INTO @Eliminados
        WHERE StockItemID = @StockItemID;

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

-- ============================================
-- Tipo de tabla para lineas de venta (TVP)
-- ============================================
IF NOT EXISTS (SELECT 1 FROM sys.types WHERE name = 'TipoLineasFactura' AND is_table_type = 1)
BEGIN
    CREATE TYPE TipoLineasFactura AS TABLE (
        StockItemID   INT,
        Quantity      INT,
        UnitPrice     DECIMAL(18,2),
        PackageTypeID INT NULL
    );
END
GO

-- ============================================
-- SP: Insertar nueva venta (encabezado + lineas)
-- ============================================
SET QUOTED_IDENTIFIER ON;
GO

CREATE OR ALTER PROCEDURE Vta_sp_InsertarVenta
    @CustomerID           INT,
    @ContactPersonID      INT,
    @SalespersonPersonID  INT,
    @LastEditedBy         INT,
    @DeliveryMethodID     INT             = 1,
    @AccountsPersonID     INT             = NULL,
    @PackedByPersonID     INT             = NULL,
    @CustomerPONumber     NVARCHAR(20)    = NULL,
    @DeliveryInstructions NVARCHAR(100)   = NULL,
    @Lineas               TipoLineasFactura READONLY,
    @NuevoID              INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Cli_Clientes WHERE CustomerID = @CustomerID)
            THROW 50001, 'El cliente especificado no existe.', 1;

        IF NOT EXISTS (SELECT 1 FROM Gen_Personas WHERE PersonID = @LastEditedBy)
            THROW 50002, 'El LastEditedBy (PersonID) especificado no existe.', 1;

        IF NOT EXISTS (SELECT 1 FROM @Lineas)
            THROW 50006, 'La venta debe tener al menos una linea de producto.', 1;

        SET @AccountsPersonID = ISNULL(@AccountsPersonID, @SalespersonPersonID);
        SET @PackedByPersonID = ISNULL(@PackedByPersonID, @SalespersonPersonID);

        BEGIN TRANSACTION;

        DECLARE @IdsInsertados TABLE (InvoiceID INT);

        INSERT INTO Vta_Facturas (
            CustomerID, BillToCustomerID, DeliveryMethodID,
            ContactPersonID, AccountsPersonID, SalespersonPersonID, PackedByPersonID,
            InvoiceDate, CustomerPurchaseOrderNumber, IsCreditNote,
            DeliveryInstructions, TotalDryItems, TotalChillerItems,
            LastEditedBy, LastEditedWhen
        )
        OUTPUT INSERTED.InvoiceID INTO @IdsInsertados
        VALUES (
            @CustomerID, @CustomerID, @DeliveryMethodID,
            @ContactPersonID, @AccountsPersonID, @SalespersonPersonID, @PackedByPersonID,
            CAST(GETDATE() AS DATE), @CustomerPONumber, 0,
            @DeliveryInstructions, 0, 0,
            @LastEditedBy, GETDATE()
        );

        SELECT @NuevoID = InvoiceID FROM @IdsInsertados;

        INSERT INTO Vta_LineasFactura (
            InvoiceID, StockItemID, Description, PackageTypeID,
            Quantity, UnitPrice, TaxRate, TaxAmount, LineProfit, ExtendedPrice,
            LastEditedBy, LastEditedWhen
        )
        SELECT
            @NuevoID,
            L.StockItemID,
            SI.StockItemName,
            ISNULL(L.PackageTypeID, SI.UnitPackageID),
            L.Quantity,
            L.UnitPrice,
            SI.TaxRate,
            ROUND(L.Quantity * L.UnitPrice * SI.TaxRate / 100, 2)                               AS TaxAmount,
            ROUND((L.Quantity * L.UnitPrice) - (L.Quantity * ISNULL(H.LastCostPrice, 0)), 2)     AS LineProfit,
            ROUND((L.Quantity * L.UnitPrice) + (L.Quantity * L.UnitPrice * SI.TaxRate / 100), 2) AS ExtendedPrice,
            @LastEditedBy, GETDATE()
        FROM @Lineas AS L
        JOIN Inv_Articulos AS SI ON SI.StockItemID = L.StockItemID
        LEFT JOIN Inv_ExistenciasArticulo AS H ON H.StockItemID = L.StockItemID;

        COMMIT TRANSACTION;

        SELECT @NuevoID AS NuevaVentaID, 'OK' AS Resultado;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- ============================================
-- SP: Actualizar venta (solo datos del encabezado)
-- ============================================
CREATE OR ALTER PROCEDURE Vta_sp_ActualizarVenta
    @InvoiceID            INT,
    @DeliveryInstructions NVARCHAR(100) = NULL,
    @CustomerPONumber     NVARCHAR(20)  = NULL,
    @LastEditedBy         INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Vta_Facturas WHERE InvoiceID = @InvoiceID)
            THROW 50003, 'La venta especificada no existe.', 1;

        IF NOT EXISTS (SELECT 1 FROM Gen_Personas WHERE PersonID = @LastEditedBy)
            THROW 50002, 'El LastEditedBy (PersonID) especificado no existe.', 1;

        BEGIN TRANSACTION;

        DECLARE @Actualizados TABLE (InvoiceID INT);

        UPDATE Vta_Facturas
        SET
            DeliveryInstructions          = @DeliveryInstructions,
            CustomerPurchaseOrderNumber   = @CustomerPONumber,
            LastEditedBy                  = @LastEditedBy,
            LastEditedWhen                = GETDATE()
        OUTPUT INSERTED.InvoiceID INTO @Actualizados
        WHERE InvoiceID = @InvoiceID;

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
-- SP: Eliminar venta (lineas primero, luego encabezado)
-- ============================================
CREATE OR ALTER PROCEDURE Vta_sp_EliminarVenta
    @InvoiceID INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Vta_Facturas WHERE InvoiceID = @InvoiceID)
            THROW 50003, 'La venta especificada no existe.', 1;

        BEGIN TRANSACTION;

        DELETE FROM Vta_LineasFactura WHERE InvoiceID = @InvoiceID;

        DECLARE @Eliminados TABLE (InvoiceID INT);

        DELETE FROM Vta_Facturas
        OUTPUT DELETED.InvoiceID INTO @Eliminados
        WHERE InvoiceID = @InvoiceID;

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