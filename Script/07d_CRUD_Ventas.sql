USE WideWorldImporters;
GO

-- ============================================
-- 07d - CRUD Ventas
-- Objetos:
--   TYPE  TipoLineasFactura
--   SP    Vta_sp_InsertarVenta
--   SP    Vta_sp_ActualizarVenta
--   SP    Vta_sp_EliminarVenta
-- Dependencias: Cli_Clientes, Inv_Articulos,
--               Inv_ExistenciasArticulo, Gen_Personas
-- ============================================

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
-- FIX   : valida que todos los StockItemID del TVP existan
--         (antes el INNER JOIN descartaba líneas en silencio)
-- FIX   : descuenta QuantityOnHand en Inv_ExistenciasArticulo
-- FIX   : calcula TotalDryItems y TotalChillerItems reales
-- FIX   : valida que los contactos existan en Gen_Personas
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
        -- ============================================
        -- Validaciones de entrada
        -- ============================================
        IF NOT EXISTS (SELECT 1 FROM Cli_Clientes WHERE CustomerID = @CustomerID)
            THROW 50001, 'El cliente especificado no existe.', 1;

        IF NOT EXISTS (SELECT 1 FROM Gen_Personas WHERE PersonID = @LastEditedBy)
            THROW 50002, 'El LastEditedBy (PersonID) especificado no existe.', 1;

        IF NOT EXISTS (SELECT 1 FROM @Lineas)
            THROW 50006, 'La venta debe tener al menos una linea de producto.', 1;

        -- [FIX] Validar contactos (opcional, pero recomendado)
        IF NOT EXISTS (SELECT 1 FROM Gen_Personas WHERE PersonID = @ContactPersonID)
            THROW 50007, 'El ContactPersonID especificado no existe.', 1;

        IF NOT EXISTS (SELECT 1 FROM Gen_Personas WHERE PersonID = @SalespersonPersonID)
            THROW 50008, 'El SalespersonPersonID especificado no existe.', 1;

        -- [FIX] Validar que TODOS los StockItemID del TVP existan
        --       (antes: INNER JOIN descartaba líneas inválidas silenciosamente)
        IF EXISTS (
            SELECT 1
            FROM @Lineas AS L
            WHERE NOT EXISTS (
                SELECT 1 FROM Inv_Articulos WHERE StockItemID = L.StockItemID
            )
        )
            THROW 50009, 'Una o más líneas hacen referencia a productos inexistentes.', 1;

        -- [FIX] Validar que no haya cantidades <= 0
        IF EXISTS (SELECT 1 FROM @Lineas WHERE Quantity <= 0)
            THROW 50010, 'Todas las líneas deben tener Quantity mayor a cero.', 1;

        -- [FIX] Validar stock suficiente
        --       (solo se aplica si decidiste descontar inventario)
        IF EXISTS (
            SELECT 1
            FROM @Lineas AS L
            LEFT JOIN Inv_ExistenciasArticulo AS H ON H.StockItemID = L.StockItemID
            WHERE ISNULL(H.QuantityOnHand, 0) < L.Quantity
        )
            THROW 50011, 'No hay stock suficiente para una o más líneas.', 1;

        SET @AccountsPersonID = ISNULL(@AccountsPersonID, @SalespersonPersonID);
        SET @PackedByPersonID = ISNULL(@PackedByPersonID, @SalespersonPersonID);

        BEGIN TRANSACTION;

        DECLARE @IdsInsertados TABLE (InvoiceID INT);

        -- ============================================
        -- Insertar encabezado
        -- ============================================
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
            @DeliveryInstructions, 0, 0,   -- se actualizarán más abajo
            @LastEditedBy, GETDATE()
        );

        SELECT @NuevoID = InvoiceID FROM @IdsInsertados;

        -- ============================================
        -- Insertar líneas
        -- ============================================
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

        -- ============================================
        -- [FIX] Actualizar TotalDryItems y TotalChillerItems
        -- ============================================
        UPDATE Vta_Facturas
        SET
            TotalDryItems = (
                SELECT ISNULL(SUM(L.Quantity), 0)
                FROM @Lineas AS L
                JOIN Inv_Articulos AS SI ON SI.StockItemID = L.StockItemID
                WHERE SI.IsChillerStock = 0
            ),
            TotalChillerItems = (
                SELECT ISNULL(SUM(L.Quantity), 0)
                FROM @Lineas AS L
                JOIN Inv_Articulos AS SI ON SI.StockItemID = L.StockItemID
                WHERE SI.IsChillerStock = 1
            )
        WHERE InvoiceID = @NuevoID;

        -- ============================================
        -- [FIX] Descontar stock del inventario
        -- ============================================
        UPDATE H
        SET
            H.QuantityOnHand = H.QuantityOnHand - L.Quantity,
            H.LastEditedBy   = @LastEditedBy,
            H.LastEditedWhen = GETDATE()
        FROM Inv_ExistenciasArticulo AS H
        JOIN @Lineas AS L ON L.StockItemID = H.StockItemID;

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
-- NOTA: por integridad, NO se reingresa el stock al inventario.
--       Si quieres revertir el stock, agregar el UPDATE aquí.
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