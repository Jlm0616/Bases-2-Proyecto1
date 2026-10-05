USE WideWorldImporters;
GO

-- ============================================================================
-- 04_SP_Productos.sql
-- Stored Procedures de Productos - Proyecto 1 Bases de Datos 2
--
-- Descripción:
--   Contiene los procedimientos almacenados para la gestión de productos,
--   incluyendo listado con filtros y detalle completo de un producto específico.
--
-- Dependencias:
--   - Inv_Articulos: Tabla principal de productos
--   - Inv_ArticuloGrupo: Relación productos-grupos
--   - Inv_GruposArticulo: Grupos de productos
--   - Inv_ExistenciasArticulo: Existencias en inventario
--   - Prov_Proveedores: Proveedores
--   - Inv_Colores: Colores de productos
--   - Inv_TiposEmpaque: Tipos de empaque
-- ============================================================================

-- ============================================================================
-- Stored Procedure: Inv_sp_ListarProductos
-- Descripción: Lista productos con filtros acumulativos opcionales
-- Uso: Consulta de productos con filtros de búsqueda flexibles
-- Nota: Agrupa múltiples grupos por producto usando STRING_AGG
-- Parámetros:
--   @Nombre: Filtro por nombre del producto (búsqueda parcial, LIKE)
--   @GrupoID: Filtro por grupo de producto (exacto)
-- Ordenamiento: Nombre del producto ascendente
-- Columnas retornadas:
--   - IdProducto: Identificador único del producto
--   - NombreProducto: Nombre del producto
--   - GrupoProducto: Grupos a los que pertenece el producto (separados por coma)
--   - CantidadEnInventario: Cantidad disponible en inventario
-- ============================================================================
CREATE OR ALTER PROCEDURE Inv_sp_ListarProductos
    @Nombre    NVARCHAR(100) = NULL,
    @GrupoID   INT           = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        SI.StockItemID                                  AS IdProducto,
        SI.StockItemName                                AS NombreProducto,
        STRING_AGG(SG.StockGroupName, ', ')
            WITHIN GROUP (ORDER BY SG.StockGroupName)   AS GrupoProducto,
        MAX(H.QuantityOnHand)                           AS CantidadEnInventario
    FROM Inv_Articulos AS SI
    LEFT JOIN Inv_ArticuloGrupo      AS AG ON AG.StockItemID  = SI.StockItemID
    LEFT JOIN Inv_GruposArticulo     AS SG ON SG.StockGroupID = AG.StockGroupID
    LEFT JOIN Inv_ExistenciasArticulo AS H ON H.StockItemID   = SI.StockItemID
    WHERE (@Nombre  IS NULL OR SI.StockItemName LIKE '%' + @Nombre + '%')
      AND (@GrupoID IS NULL OR EXISTS (
              SELECT 1
              FROM Inv_ArticuloGrupo AS AG2
              WHERE AG2.StockItemID = SI.StockItemID
                AND AG2.StockGroupID = @GrupoID
          ))
    GROUP BY SI.StockItemID, SI.StockItemName
    ORDER BY SI.StockItemName ASC;
END
GO


-- ============================================================================
-- Stored Procedure: Inv_sp_DetalleProducto
-- Descripción: Obtiene el detalle completo de un producto específico
-- Uso: Cargar datos de un producto para visualización o edición
-- Parámetros:
--   @StockItemID: Identificador único del producto a consultar
-- Columnas retornadas:
--   - IdProducto: Identificador único del producto
--   - NombreProducto: Nombre del producto
--   - IdProveedor: Identificador del proveedor
--   - NombreProveedor: Nombre del proveedor
--   - IdColor: Identificador del color
--   - Color: Nombre del color
--   - IdUnidadEmpaquetamiento: Identificador de unidad de empaque
--   - UnidadEmpaquetamiento: Tipo de unidad de empaque
--   - IdEmpaquetamiento: Identificador de empaque exterior
--   - Empaquetamiento: Tipo de empaque exterior
--   - CantidadEmpaquetamiento: Cantidad por empaque exterior
--   - Marca: Marca del producto
--   - TallaTamano: Tamaño del producto
--   - Impuesto: Tasa de impuesto
--   - PrecioUnitario: Precio unitario
--   - PrecioVenta: Precio de venta recomendado
--   - Peso: Peso típico por unidad
--   - PalabrasClave: Palabras clave para búsqueda
--   - CantidadDisponible: Cantidad disponible en inventario
--   - Ubicacion: Ubicación en el almacén
-- ============================================================================
CREATE OR ALTER PROCEDURE Inv_sp_DetalleProducto
    @StockItemID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        SI.StockItemID                AS IdProducto,
        SI.StockItemName              AS NombreProducto,
        SI.SupplierID                 AS IdProveedor,
        PR.SupplierName               AS NombreProveedor,
        SI.ColorID                    AS IdColor,
        COL.ColorName                 AS Color,
        SI.UnitPackageID              AS IdUnidadEmpaquetamiento,
        UP.PackageTypeName            AS UnidadEmpaquetamiento,
        SI.OuterPackageID             AS IdEmpaquetamiento,
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
