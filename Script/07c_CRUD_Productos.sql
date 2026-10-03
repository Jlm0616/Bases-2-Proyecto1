USE WideWorldImporters;
GO

-- ============================================
-- 07c - CRUD Productos
-- Procedimientos:
--   Inv_sp_InsertarProducto
--   Inv_sp_ActualizarProducto
--   Inv_sp_EliminarProducto
-- Dependencias: Prov_Proveedores, Gen_Personas,
--               Vta_LineasFactura, Cmp_LineasOrdenCompra
-- ============================================

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
-- Acepta los mismos campos que Insertar (formulario completo)
-- FIX: también sincroniza LastCostPrice en Inv_ExistenciasArticulo
--      para que el cálculo de LineProfit en ventas use el costo real.
-- NOTA: SearchDetails es una columna computada → no se puede actualizar.
-- ============================================
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