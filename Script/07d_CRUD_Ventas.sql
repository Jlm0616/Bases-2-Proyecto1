USE WideWorldImporters;
GO

-- ============================================================================
-- Table Type: TipoLineasFactura
-- Descripción: Tipo de tabla (Table-Valued Parameter) para pasar múltiples líneas de factura como parámetro
-- Uso: Se utiliza como parámetro de entrada en Vta_sp_InsertarVenta para insertar todas las líneas de una venta en una sola operación
-- Columnas:
--   - StockItemID: Identificador del producto
--   - Quantity: Cantidad de unidades del producto
--   - UnitPrice: Precio unitario de venta
--   - PackageTypeID: Identificador del tipo de empaque (opcional)
-- ============================================================================

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


-- ============================================================================
-- Stored Procedure: Vta_sp_InsertarVenta
-- Descripción: Inserta una nueva venta con su encabezado y líneas de detalle, actualizando el inventario y calculando totales automáticamente
-- Uso: Se utiliza para registrar ventas completas, validando existencias, calculando impuestos y ganancias, y descontando stock del inventario
-- Parámetros:
--   - @CustomerID: Identificador del cliente (obligatorio)
--   - @ContactPersonID: Identificador de la persona de contacto (obligatorio)
--   - @SalespersonPersonID: Identificador del vendedor (obligatorio)
--   - @LastEditedBy: Identificador de la persona que realiza la edición (obligatorio)
--   - @DeliveryMethodID: Identificador del método de entrega (opcional, default 1)
--   - @AccountsPersonID: Identificador de la persona de cuentas (opcional, usa SalespersonPersonID si es NULL)
--   - @PackedByPersonID: Identificador de la persona que empaca (opcional, usa SalespersonPersonID si es NULL)
--   - @CustomerPONumber: Número de orden de compra del cliente (opcional)
--   - @DeliveryInstructions: Instrucciones de entrega (opcional)
--   - @Lineas: Tabla TipoLineasFactura con las líneas de la venta (obligatorio, READONLY)
--   - @NuevoID: Parámetro OUTPUT que retorna el ID de la venta insertada
-- Tablas origen: Vta_Facturas, Vta_LineasFactura, Cli_Clientes, Inv_Articulos, Inv_ExistenciasArticulo, Gen_Personas
-- Columnas retornadas:
--   - NuevaVentaID: Identificador de la venta recién insertada
--   - Resultado: 'OK' si la operación fue exitosa
-- Notas: Valida stock suficiente, calcula automáticamente TaxAmount, LineProfit y ExtendedPrice, actualiza TotalDryItems y TotalChillerItems
-- ============================================================================

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

        IF NOT EXISTS (SELECT 1 FROM Gen_Personas WHERE PersonID = @ContactPersonID)
            THROW 50007, 'El ContactPersonID especificado no existe.', 1;

        IF NOT EXISTS (SELECT 1 FROM Gen_Personas WHERE PersonID = @SalespersonPersonID)
            THROW 50008, 'El SalespersonPersonID especificado no existe.', 1;

        IF EXISTS (
            SELECT 1
            FROM @Lineas AS L
            WHERE NOT EXISTS (
                SELECT 1 FROM Inv_Articulos WHERE StockItemID = L.StockItemID
            )
        )
            THROW 50009, 'Una o más líneas hacen referencia a productos inexistentes.', 1;

        IF EXISTS (SELECT 1 FROM @Lineas WHERE Quantity <= 0)
            THROW 50010, 'Todas las líneas deben tener Quantity mayor a cero.', 1;

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


-- ============================================================================
-- Stored Procedure: Vta_sp_ActualizarVenta
-- Descripción: Actualiza solo los datos del encabezado de una venta existente (instrucciones de entrega y número de orden de compra)
-- Uso: Se utiliza para modificar información administrativa de una venta ya registrada, sin afectar las líneas de detalle
-- Parámetros:
--   - @InvoiceID: Identificador de la venta a actualizar (obligatorio)
--   - @DeliveryInstructions: Nuevas instrucciones de entrega (opcional)
--   - @CustomerPONumber: Nuevo número de orden de compra del cliente (opcional)
--   - @LastEditedBy: Identificador de la persona que realiza la edición (obligatorio)
-- Tablas origen: Vta_Facturas, Gen_Personas
-- Columnas retornadas:
--   - FilasAfectadas: Cantidad de filas actualizadas (debe ser 1)
--   - Resultado: 'OK' si la operación fue exitosa
-- Notas: No modifica las líneas de factura ni el inventario, solo datos administrativos del encabezado
-- ============================================================================

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


-- ============================================================================
-- Stored Procedure: Vta_sp_EliminarVenta
-- Descripción: Elimina una venta del sistema, eliminando primero las líneas de factura y luego el encabezado
-- Uso: Se utiliza para eliminar ventas registradas, manteniendo la integridad referencial mediante eliminación en cascada manual
-- Parámetros:
--   - @InvoiceID: Identificador de la venta a eliminar (obligatorio)
-- Tablas origen: Vta_Facturas, Vta_LineasFactura
-- Columnas retornadas:
--   - FilasAfectadas: Cantidad de filas eliminadas del encabezado (debe ser 1)
--   - Resultado: 'OK' si la operación fue exitosa
-- Notas: Por diseño, NO reingresa el stock al inventario. Si se requiere revertir el stock, se debe agregar el UPDATE correspondiente
-- ============================================================================

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