USE WideWorldImporters;
GO

-- ============================================
-- SP: Listar productos con filtros acumulativos
-- Filtros: nombre (texto libre), grupo (seleccion)
-- Orden por defecto: nombre del producto ascendente
-- ============================================
CREATE OR ALTER PROCEDURE Inv_sp_ListarProductos
    @Nombre    NVARCHAR(100) = NULL,
    @GrupoID   INT           = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        SI.StockItemID              AS IdProducto,
        SI.StockItemName            AS NombreProducto,
        SG.StockGroupName           AS GrupoProducto,
        H.QuantityOnHand            AS CantidadEnInventario
    FROM Inv_Articulos AS SI
    LEFT JOIN Inv_ArticuloGrupo AS AG ON AG.StockItemID  = SI.StockItemID
    LEFT JOIN Inv_GruposArticulo AS SG ON SG.StockGroupID = AG.StockGroupID
    LEFT JOIN Inv_ExistenciasArticulo AS H ON H.StockItemID = SI.StockItemID
    WHERE (@Nombre  IS NULL OR SI.StockItemName LIKE '%' + @Nombre + '%')
      AND (@GrupoID IS NULL OR AG.StockGroupID = @GrupoID)
    ORDER BY SI.StockItemName ASC;
END
GO

-- ============================================
-- SP: Detalle de un producto específico
-- ============================================
CREATE OR ALTER PROCEDURE Inv_sp_DetalleProducto
    @StockItemID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        SI.StockItemID                AS IdProducto,
        SI.StockItemName              AS NombreProducto,
        PR.SupplierName               AS NombreProveedor,
        COL.ColorName                 AS Color,
        UP.PackageTypeName            AS UnidadEmpaquetamiento,
        OP.PackageTypeName            AS Empaquetamiento,
        SI.QuantityPerOuter           AS CantidadEmpaquetamiento,
        SI.Brand                      AS Marca,
        SI.Size                       AS TallaTamano,
        SI.TaxRate                    AS Impuesto,
        SI.UnitPrice                  AS PrecioUnitario,
        SI.RecommendedRetailPrice     AS PrecioVenta,
        SI.TypicalWeightPerUnit       AS Peso,
        SI.SearchDetails              AS PalabrasClave,
        H.QuantityOnHand              AS CantidadDisponible,
        H.BinLocation                 AS Ubicacion
    FROM Inv_Articulos AS SI
    LEFT JOIN Prov_Proveedores AS PR  ON PR.SupplierID    = SI.SupplierID
    LEFT JOIN Inv_Colores AS COL      ON COL.ColorID      = SI.ColorID
    LEFT JOIN Inv_TiposEmpaque AS UP  ON UP.PackageTypeID = SI.UnitPackageID
    LEFT JOIN Inv_TiposEmpaque AS OP  ON OP.PackageTypeID = SI.OuterPackageID
    LEFT JOIN Inv_ExistenciasArticulo AS H ON H.StockItemID = SI.StockItemID
    WHERE SI.StockItemID = @StockItemID;
END
GO