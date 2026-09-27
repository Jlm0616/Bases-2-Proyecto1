SET QUOTED_IDENTIFIER ON;
GO

USE WideWorldImporters;
DECLARE @Lineas TipoLineasFactura;
INSERT INTO @Lineas (StockItemID, Quantity, UnitPrice) VALUES (1, 5, 10.00), (2, 3, 25.50);

DECLARE @Id INT;
EXEC Vta_sp_InsertarVenta
    @CustomerID = 1,
    @ContactPersonID = 1361,
    @SalespersonPersonID = 1361,
    @LastEditedBy = 1361,
    @Lineas = @Lineas,
    @NuevoID = @Id OUTPUT;