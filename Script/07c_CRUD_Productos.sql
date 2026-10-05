USE WideWorldImporters;
GO

-- ============================================================================
-- Stored Procedure: Inv_sp_InsertarProducto
-- Descripción: Inserta un nuevo producto en el sistema, creando simultáneamente el registro de inventario correspondiente
-- Uso: Se utiliza para registrar nuevos productos en el catálogo, con configuración inicial de existencias y parámetros de inventario
-- Parámetros:
--   - @NombreProducto: Nombre del producto (obligatorio)
--   - @SupplierID: Identificador del proveedor (obligatorio)
--   - @UnitPackageID: Identificador del tipo de empaque unitario (obligatorio)
--   - @OuterPackageID: Identificador del tipo de empaque exterior (obligatorio)
--   - @LastEditedBy: Identificador de la persona que realiza la edición (obligatorio)
--   - @ColorID: Identificador del color (opcional)
--   - @Marca: Marca del producto (opcional)
--   - @Talla: Tamaño del producto (opcional)
--   - @LeadTimeDays: Días de tiempo de entrega (opcional, default 7)
--   - @QuantityPerOuter: Cantidad por empaque exterior (opcional, default 1)
--   - @IsChillerStock: Indica si requiere refrigeración (opcional, default 0)
--   - @TaxRate: Tasa de impuesto (opcional, default 15.000)
--   - @UnitPrice: Precio unitario de costo (opcional, default 0)
--   - @PrecioVenta: Precio de venta recomendado (opcional)
--   - @Peso: Peso típico por unidad (opcional, default 0.000)
--   - @NuevoID: Parámetro OUTPUT que retorna el ID del producto insertado
-- Tablas origen: Inv_Articulos, Prov_Proveedores, Gen_Personas, Inv_ExistenciasArticulo
-- Columnas retornadas:
--   - NuevoProductoID: Identificador del producto recién insertado
--   - Resultado: 'OK' si la operación fue exitosa
-- Notas: Crea automáticamente el registro en Inv_ExistenciasArticulo con valores iniciales
-- ============================================================================

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


-- ============================================================================
-- Stored Procedure: Inv_sp_ActualizarProducto
-- Descripción: Actualiza los datos de un producto existente, sincronizando el costo en el registro de inventario para cálculos de ganancia
-- Uso: Se utiliza para modificar la información de productos, actualizando automáticamente el LastCostPrice en Inv_ExistenciasArticulo
-- Parámetros:
--   - @StockItemID: Identificador del producto a actualizar (obligatorio)
--   - @NombreProducto: Nuevo nombre del producto (obligatorio)
--   - @SupplierID: Nuevo identificador del proveedor (obligatorio)
--   - @UnitPackageID: Nuevo identificador de empaque unitario (opcional, mantiene valor actual si es NULL)
--   - @OuterPackageID: Nuevo identificador de empaque exterior (opcional, mantiene valor actual si es NULL)
--   - @UnitPrice: Nuevo precio unitario de costo (opcional, default 0)
--   - @PrecioVenta: Nuevo precio de venta recomendado (opcional)
--   - @TaxRate: Nueva tasa de impuesto (opcional, default 15.000)
--   - @LastEditedBy: Identificador de la persona que realiza la edición (obligatorio)
--   - @ColorID: Nuevo identificador de color (opcional, mantiene valor actual si es NULL)
--   - @Marca: Nueva marca del producto (opcional, mantiene valor actual si es NULL)
--   - @Talla: Nuevo tamaño del producto (opcional, mantiene valor actual si es NULL)
--   - @LeadTimeDays: Nuevos días de tiempo de entrega (opcional, mantiene valor actual si es NULL)
--   - @QuantityPerOuter: Nueva cantidad por empaque exterior (opcional, mantiene valor actual si es NULL)
--   - @Peso: Nuevo peso típico por unidad (opcional, mantiene valor actual si es NULL)
-- Tablas origen: Inv_Articulos, Prov_Proveedores, Gen_Personas, Inv_ExistenciasArticulo
-- Columnas retornadas:
--   - FilasAfectadas: Cantidad de filas actualizadas (debe ser 1)
--   - Resultado: 'OK' si la operación fue exitosa
-- Notas: Sincroniza LastCostPrice en Inv_ExistenciasArticulo para asegurar cálculos correctos de LineProfit en ventas
-- ============================================================================

CREATE OR ALTER PROCEDURE Inv_sp_ActualizarProducto
    @StockItemID        INT,
    @NombreProducto     NVARCHAR(100),
    @SupplierID         INT,
    @UnitPackageID      INT             = NULL,
    @OuterPackageID     INT             = NULL,
    @UnitPrice          DECIMAL(18,2)   = 0,
    @PrecioVenta        DECIMAL(18,2)   = NULL,
    @TaxRate            DECIMAL(18,3)   = 15.000,
    @LastEditedBy       INT,
    @ColorID            INT             = NULL,
    @Marca              NVARCHAR(50)    = NULL,
    @Talla              NVARCHAR(20)    = NULL,
    @LeadTimeDays       INT             = NULL,
    @QuantityPerOuter   INT             = NULL,
    @Peso               DECIMAL(18,3)   = NULL
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
            UnitPackageID           = ISNULL(@UnitPackageID, UnitPackageID),
            OuterPackageID          = ISNULL(@OuterPackageID, OuterPackageID),
            UnitPrice               = @UnitPrice,
            RecommendedRetailPrice  = @PrecioVenta,
            TaxRate                 = @TaxRate,
            ColorID                 = ISNULL(@ColorID, ColorID),
            Brand                   = ISNULL(@Marca, Brand),
            Size                    = ISNULL(@Talla, Size),
            LeadTimeDays            = ISNULL(@LeadTimeDays, LeadTimeDays),
            QuantityPerOuter        = ISNULL(@QuantityPerOuter, QuantityPerOuter),
            TypicalWeightPerUnit    = ISNULL(@Peso, TypicalWeightPerUnit),
            LastEditedBy            = @LastEditedBy
        OUTPUT INSERTED.StockItemID INTO @Actualizados
        WHERE StockItemID = @StockItemID;

        IF EXISTS (SELECT 1 FROM Inv_ExistenciasArticulo WHERE StockItemID = @StockItemID)
        BEGIN
            UPDATE Inv_ExistenciasArticulo
            SET
                LastCostPrice  = @UnitPrice,
                LastEditedBy   = @LastEditedBy,
                LastEditedWhen = GETDATE()
            WHERE StockItemID = @StockItemID;
        END
        ELSE
        BEGIN
            INSERT INTO Inv_ExistenciasArticulo (
                StockItemID, QuantityOnHand, BinLocation,
                LastStocktakeQuantity, LastCostPrice, ReorderLevel, TargetStockLevel,
                LastEditedBy, LastEditedWhen
            )
            VALUES (
                @StockItemID, 0, 'Sin asignar',
                0, @UnitPrice, 10, 50,
                @LastEditedBy, GETDATE()
            );
        END

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
-- Stored Procedure: Inv_sp_EliminarProducto
-- Descripción: Elimina un producto del sistema junto con su registro de inventario, verificando previamente que no tenga ventas ni compras registradas
-- Uso: Se utiliza para eliminar productos que no tienen historial de transacciones, garantizando integridad referencial
-- Parámetros:
--   - @StockItemID: Identificador del producto a eliminar (obligatorio)
-- Tablas origen: Inv_Articulos, Inv_ExistenciasArticulo, Vta_LineasFactura, Cmp_LineasOrdenCompra
-- Columnas retornadas:
--   - FilasAfectadas: Cantidad de filas eliminadas (debe ser 1)
--   - Resultado: 'OK' si la operación fue exitosa
-- Notas: Arroja error si el producto tiene ventas u órdenes de compra registradas para mantener integridad referencial
-- ============================================================================

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