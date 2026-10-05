USE WideWorldImporters;
GO

-- ============================================================================
-- Stored Procedure: Rpt_sp_MontosProveedores
-- Descripción: Calcula los montos más alto, más bajo y promedio de las órdenes de compra agrupadas por proveedor y categoría de proveedor, con subtotales mediante ROLLUP
-- Uso: Se utiliza para analizar el comportamiento de compras por proveedor y categoría, permitiendo identificar rangos de montos y tendencias de compra
-- Parámetros:
--   - @NombreProveedor: Filtro opcional por nombre del proveedor (búsqueda parcial con LIKE)
--   - @Categoria: Filtro opcional por categoría de proveedor (búsqueda parcial con LIKE)
-- Tablas origen: Cmp_OrdenesCompra, Prov_Proveedores, Prov_CategoriasProveedor, Cmp_LineasOrdenCompra
-- Ordenamiento: Categoría de proveedor ascendente, luego nombre de proveedor ascendente (subtotales al final)
-- Columnas retornadas:
--   - CategoriaProveedor: Nombre de la categoría del proveedor (NULL en filas de subtotal)
--   - NombreProveedor: Nombre del proveedor (NULL en filas de subtotal por categoría)
--   - MontoMasAlto: Monto más alto de las órdenes de compra del proveedor
--   - MontoMasBajo: Monto más bajo de las órdenes de compra del proveedor
--   - MontoPromedio: Monto promedio de las órdenes de compra del proveedor
-- ============================================================================

CREATE OR ALTER PROCEDURE Rpt_sp_MontosProveedores
    @NombreProveedor NVARCHAR(100) = NULL,
    @Categoria       NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        PC.SupplierCategoryName          AS CategoriaProveedor,
        P.SupplierName                   AS NombreProveedor,
        MAX(M.MontoTotal)                AS MontoMasAlto,
        MIN(M.MontoTotal)                AS MontoMasBajo,
        AVG(M.MontoTotal)                AS MontoPromedio
    FROM Cmp_OrdenesCompra AS PO
    JOIN Prov_Proveedores AS P ON P.SupplierID = PO.SupplierID
    JOIN Prov_CategoriasProveedor AS PC ON PC.SupplierCategoryID = P.SupplierCategoryID
    CROSS APPLY (
        SELECT COALESCE(SUM(POL.OrderedOuters * POL.ExpectedUnitPricePerOuter), 0) AS MontoTotal
        FROM Cmp_LineasOrdenCompra AS POL
        WHERE POL.PurchaseOrderID = PO.PurchaseOrderID
    ) AS M
    WHERE (@NombreProveedor IS NULL OR P.SupplierName LIKE '%' + @NombreProveedor + '%')
      AND (@Categoria IS NULL OR PC.SupplierCategoryName LIKE '%' + @Categoria + '%')
    GROUP BY ROLLUP (PC.SupplierCategoryName, P.SupplierName)
    ORDER BY 
        CASE WHEN PC.SupplierCategoryName IS NULL THEN 1 ELSE 0 END,
        PC.SupplierCategoryName,
        CASE WHEN P.SupplierName IS NULL THEN 1 ELSE 0 END,
        P.SupplierName;
END
GO


-- ============================================================================
-- Stored Procedure: Rpt_sp_MontosClientes
-- Descripción: Calcula los montos más alto, más bajo y promedio de las facturas de ventas agrupadas por cliente y categoría de cliente, con subtotales mediante ROLLUP
-- Uso: Se utiliza para analizar el comportamiento de ventas por cliente y categoría, permitiendo identificar rangos de montos y tendencias de compra
-- Parámetros:
--   - @NombreCliente: Filtro opcional por nombre del cliente (búsqueda parcial con LIKE)
--   - @Categoria: Filtro opcional por categoría de cliente (búsqueda parcial con LIKE)
-- Tablas origen: Vta_Facturas, Cli_Clientes, Cli_CategoriasCliente, Vta_LineasFactura
-- Ordenamiento: Categoría de cliente ascendente, luego nombre de cliente ascendente (subtotales al final)
-- Columnas retornadas:
--   - CategoriaCliente: Nombre de la categoría del cliente (NULL en filas de subtotal)
--   - NombreCliente: Nombre del cliente (NULL en filas de subtotal por categoría)
--   - MontoMasAlto: Monto más alto de las facturas del cliente
--   - MontoMasBajo: Monto más bajo de las facturas del cliente
--   - MontoPromedio: Monto promedio de las facturas del cliente
-- ============================================================================

CREATE OR ALTER PROCEDURE Rpt_sp_MontosClientes
    @NombreCliente NVARCHAR(100) = NULL,
    @Categoria     NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        CC.CustomerCategoryName          AS CategoriaCliente,
        C.CustomerName                   AS NombreCliente,
        MAX(M.MontoTotal)                AS MontoMasAlto,
        MIN(M.MontoTotal)                AS MontoMasBajo,
        AVG(M.MontoTotal)                AS MontoPromedio
    FROM Vta_Facturas AS I
    JOIN Cli_Clientes AS C ON C.CustomerID = I.CustomerID
    JOIN Cli_CategoriasCliente AS CC ON CC.CustomerCategoryID = C.CustomerCategoryID
    CROSS APPLY (
        SELECT COALESCE(SUM(IL.ExtendedPrice), 0) AS MontoTotal
        FROM Vta_LineasFactura AS IL
        WHERE IL.InvoiceID = I.InvoiceID
    ) AS M
    WHERE I.IsCreditNote = 0
      AND (@NombreCliente IS NULL OR C.CustomerName LIKE '%' + @NombreCliente + '%')
      AND (@Categoria IS NULL OR CC.CustomerCategoryName LIKE '%' + @Categoria + '%')
    GROUP BY ROLLUP (CC.CustomerCategoryName, C.CustomerName)
    ORDER BY 
        CASE WHEN CC.CustomerCategoryName IS NULL THEN 1 ELSE 0 END,
        CC.CustomerCategoryName,
        CASE WHEN C.CustomerName IS NULL THEN 1 ELSE 0 END,
        C.CustomerName;
END
GO


-- ============================================================================
-- Stored Procedure: Rpt_sp_Top5ProductosPorGanancia
-- Descripción: Lista los 5 productos con mayor ganancia total en ventas, agrupados por año
-- Uso: Se utiliza para identificar los productos más rentables por año, permitiendo análisis de rentabilidad y toma de decisiones de inventario
-- Parámetros:
--   - @Anio: Filtro opcional por año específico (si es NULL, muestra todos los años)
-- Tablas origen: Vta_LineasFactura, Vta_Facturas, Inv_Articulos
-- Ordenamiento: Año ascendente, luego posición (1-5) ascendente
-- Columnas retornadas:
--   - Anio: Año de la venta
--   - Posicion: Ranking del producto dentro del año (1 = mayor ganancia)
--   - NombreProducto: Nombre del producto
--   - GananciaTotal: Suma total de ganancias generadas por el producto en el año
-- ============================================================================

CREATE OR ALTER PROCEDURE Rpt_sp_Top5ProductosPorGanancia
    @Anio INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    WITH GananciaPorProducto AS (
        SELECT
            YEAR(I.InvoiceDate)      AS Anio,
            SI.StockItemID,
            SI.StockItemName         AS NombreProducto,
            SUM(IL.LineProfit)       AS GananciaTotal
        FROM Vta_LineasFactura AS IL
        JOIN Vta_Facturas AS I    ON I.InvoiceID = IL.InvoiceID
        JOIN Inv_Articulos AS SI  ON SI.StockItemID = IL.StockItemID
        WHERE I.IsCreditNote = 0
          AND (@Anio IS NULL OR YEAR(I.InvoiceDate) = @Anio)
        GROUP BY YEAR(I.InvoiceDate), SI.StockItemID, SI.StockItemName
    ),
    Ranking AS (
        SELECT
            Anio,
            NombreProducto,
            GananciaTotal,
            DENSE_RANK() OVER (PARTITION BY Anio ORDER BY GananciaTotal DESC) AS Posicion
        FROM GananciaPorProducto
    )
    SELECT 
        Anio, 
        Posicion, 
        NombreProducto, 
        GananciaTotal
    FROM Ranking
    WHERE Posicion <= 5
    ORDER BY Anio, Posicion;
END
GO


-- ============================================================================
-- Stored Procedure: Rpt_sp_Top5ClientesPorFacturas
-- Descripción: Lista los 5 clientes con mayor cantidad de facturas emitidas, agrupados por año, junto con el monto total facturado
-- Uso: Se utiliza para identificar los clientes más frecuentes por año, permitiendo análisis de fidelización y volumen de negocio
-- Parámetros:
--   - @AnioInicio: Filtro opcional para el año inicial del rango (si es NULL, sin límite inferior)
--   - @AnioFin: Filtro opcional para el año final del rango (si es NULL, sin límite superior)
-- Tablas origen: Vta_Facturas, Cli_Clientes, Vta_LineasFactura
-- Ordenamiento: Año ascendente, luego posición (1-5) ascendente
-- Columnas retornadas:
--   - Anio: Año de las facturas
--   - Posicion: Ranking del cliente dentro del año (1 = mayor cantidad de facturas)
--   - NombreCliente: Nombre del cliente
--   - CantidadFacturas: Cantidad total de facturas emitidas al cliente en el año
--   - MontoTotalFacturado: Suma total del monto facturado al cliente en el año
-- ============================================================================

CREATE OR ALTER PROCEDURE Rpt_sp_Top5ClientesPorFacturas
    @AnioInicio INT = NULL,
    @AnioFin    INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    WITH FacturasPorCliente AS (
        SELECT
            YEAR(I.InvoiceDate)    AS Anio,
            C.CustomerID,
            C.CustomerName         AS NombreCliente,
            COUNT(*)               AS CantidadFacturas,
            SUM(M.MontoTotal)      AS MontoTotalFacturado
        FROM Vta_Facturas AS I
        JOIN Cli_Clientes AS C ON C.CustomerID = I.CustomerID
        CROSS APPLY (
            SELECT COALESCE(SUM(IL.ExtendedPrice), 0) AS MontoTotal
            FROM Vta_LineasFactura AS IL
            WHERE IL.InvoiceID = I.InvoiceID
        ) AS M
        WHERE I.IsCreditNote = 0
          AND (@AnioInicio IS NULL OR YEAR(I.InvoiceDate) >= @AnioInicio)
          AND (@AnioFin    IS NULL OR YEAR(I.InvoiceDate) <= @AnioFin)
        GROUP BY YEAR(I.InvoiceDate), C.CustomerID, C.CustomerName
    ),
    Ranking AS (
        SELECT
            Anio,
            NombreCliente,
            CantidadFacturas,
            MontoTotalFacturado,
            DENSE_RANK() OVER (PARTITION BY Anio ORDER BY CantidadFacturas DESC) AS Posicion
        FROM FacturasPorCliente
    )
    SELECT 
        Anio, 
        Posicion, 
        NombreCliente, 
        CantidadFacturas, 
        MontoTotalFacturado
    FROM Ranking
    WHERE Posicion <= 5
    ORDER BY Anio, Posicion;
END
GO


-- ============================================================================
-- Stored Procedure: Rpt_sp_Top5ProveedoresPorOrdenes
-- Descripción: Lista los 5 proveedores con mayor cantidad de órdenes de compra, agrupados por año, junto con el monto total comprado
-- Uso: Se utiliza para identificar los proveedores más frecuentes por año, permitiendo análisis de relaciones comerciales y volumen de compras
-- Parámetros:
--   - @AnioInicio: Filtro opcional para el año inicial del rango (si es NULL, sin límite inferior)
--   - @AnioFin: Filtro opcional para el año final del rango (si es NULL, sin límite superior)
-- Tablas origen: Cmp_OrdenesCompra, Prov_Proveedores, Cmp_LineasOrdenCompra
-- Ordenamiento: Año ascendente, luego posición (1-5) ascendente
-- Columnas retornadas:
--   - Anio: Año de las órdenes de compra
--   - Posicion: Ranking del proveedor dentro del año (1 = mayor cantidad de órdenes)
--   - NombreProveedor: Nombre del proveedor
--   - CantidadOrdenes: Cantidad total de órdenes de compra al proveedor en el año
--   - MontoTotalComprado: Suma total del monto comprado al proveedor en el año
-- ============================================================================

CREATE OR ALTER PROCEDURE Rpt_sp_Top5ProveedoresPorOrdenes
    @AnioInicio INT = NULL,
    @AnioFin    INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    WITH OrdenesPorProveedor AS (
        SELECT
            YEAR(PO.OrderDate)     AS Anio,
            P.SupplierID,
            P.SupplierName         AS NombreProveedor,
            COUNT(*)               AS CantidadOrdenes,
            SUM(M.MontoTotal)      AS MontoTotalComprado
        FROM Cmp_OrdenesCompra AS PO
        JOIN Prov_Proveedores AS P ON P.SupplierID = PO.SupplierID
        CROSS APPLY (
            SELECT COALESCE(SUM(POL.OrderedOuters * POL.ExpectedUnitPricePerOuter), 0) AS MontoTotal
            FROM Cmp_LineasOrdenCompra AS POL
            WHERE POL.PurchaseOrderID = PO.PurchaseOrderID
        ) AS M
        WHERE (@AnioInicio IS NULL OR YEAR(PO.OrderDate) >= @AnioInicio)
          AND (@AnioFin IS NULL OR YEAR(PO.OrderDate) <= @AnioFin)
        GROUP BY YEAR(PO.OrderDate), P.SupplierID, P.SupplierName
    ),
    Ranking AS (
        SELECT
            Anio,
            NombreProveedor,
            CantidadOrdenes,
            MontoTotalComprado,
            DENSE_RANK() OVER (PARTITION BY Anio ORDER BY CantidadOrdenes DESC) AS Posicion
        FROM OrdenesPorProveedor
    )
    SELECT 
        Anio, 
        Posicion, 
        NombreProveedor, 
        CantidadOrdenes, 
        MontoTotalComprado
    FROM Ranking
    WHERE Posicion <= 5
    ORDER BY Anio, Posicion;
END
GO


-- ============================================================================
-- Stored Procedure: Rpt_sp_MatrizVentasPorCategoria
-- Descripción: Genera una matriz de ventas con las categorías de producto como filas y los años como columnas, mostrando el monto total vendido por categoría en cada año
-- Uso: Se utiliza para analizar la evolución de ventas por categoría de producto a través de los años, permitiendo identificar tendencias y patrones estacionales
-- Tablas origen: Vta_LineasFactura, Vta_Facturas, Inv_ArticuloGrupo, Inv_GruposArticulo
-- Ordenamiento: Nombre de la categoría de producto ascendente
-- Columnas retornadas:
--   - CategoriaProducto: Nombre de la categoría de producto
--   - Anio2013: Monto total vendido en el año 2013 para la categoría
--   - Anio2014: Monto total vendido en el año 2014 para la categoría
--   - Anio2015: Monto total vendido en el año 2015 para la categoría
--   - Anio2016: Monto total vendido en el año 2016 para la categoría
-- ============================================================================

CREATE OR ALTER PROCEDURE Rpt_sp_MatrizVentasPorCategoria
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        CategoriaProducto,
        ISNULL([2013], 0) AS Anio2013,
        ISNULL([2014], 0) AS Anio2014,
        ISNULL([2015], 0) AS Anio2015,
        ISNULL([2016], 0) AS Anio2016
    FROM (
        SELECT
            SG.StockGroupName    AS CategoriaProducto,
            YEAR(I.InvoiceDate)  AS Anio,
            IL.ExtendedPrice     AS Monto
        FROM Vta_LineasFactura AS IL
        JOIN Vta_Facturas AS I ON I.InvoiceID = IL.InvoiceID
        OUTER APPLY (
            SELECT TOP 1 SG2.StockGroupName
            FROM Inv_ArticuloGrupo AG2
            JOIN Inv_GruposArticulo SG2 ON SG2.StockGroupID = AG2.StockGroupID
            WHERE AG2.StockItemID = IL.StockItemID
            ORDER BY SG2.StockGroupName
        ) AS SG
        WHERE I.IsCreditNote = 0
    ) AS Origen
    PIVOT (
        SUM(Monto) FOR Anio IN ([2013], [2014], [2015], [2016])
    ) AS Matriz
    ORDER BY CategoriaProducto;
END
GO


-- ============================================================================
-- Stored Procedure: Rpt_sp_SeguimientoComprasCliente
-- Descripción: Proporciona un resumen mensual de las compras realizadas por cada cliente, incluyendo estadísticas de cantidades y montos
-- Uso: Se utiliza para analizar el patrón de compras de los clientes a lo largo del tiempo, permitiendo identificar estacionalidad y comportamiento de compra
-- Parámetros:
--   - @Anio: Filtro opcional por año específico
--   - @Mes: Filtro opcional por mes específico (1-12)
--   - @Categoria: Filtro opcional por categoría de producto
--   - @Subcategoria: Filtro opcional por subcategoría de producto
-- Tablas origen: Vta_LineasFactura, Vta_Facturas, Cli_Clientes, Inv_ArticuloGrupo, Inv_GruposArticulo
-- Ordenamiento: Nombre del cliente ascendente, luego año ascendente, luego mes ascendente
-- Columnas retornadas:
--   - IdCliente: Identificador único del cliente
--   - NombreCliente: Nombre del cliente
--   - Anio: Año de las compras
--   - Mes: Mes de las compras
--   - PrimeraFacturaDelMes: Fecha de la primera factura del mes
--   - UltimaFacturaDelMes: Fecha de la última factura del mes
--   - MontoTotalComprado: Suma total del monto comprado en el mes
--   - CantidadTotalComprada: Suma total de unidades compradas en el mes
--   - CantidadMinimaPorLinea: Cantidad mínima en una línea de factura del mes
--   - CantidadMaximaPorLinea: Cantidad máxima en una línea de factura del mes
-- ============================================================================

CREATE OR ALTER PROCEDURE Rpt_sp_SeguimientoComprasCliente
    @Anio       INT           = NULL,
    @Mes        INT           = NULL,
    @Categoria  NVARCHAR(100) = NULL,
    @Subcategoria NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        C.CustomerID                       AS IdCliente,
        C.CustomerName                     AS NombreCliente,
        YEAR(I.InvoiceDate)                AS Anio,
        MONTH(I.InvoiceDate)               AS Mes,
        MIN(I.InvoiceDate)                 AS PrimeraFacturaDelMes,
        MAX(I.InvoiceDate)                 AS UltimaFacturaDelMes,
        SUM(IL.ExtendedPrice)              AS MontoTotalComprado,
        SUM(IL.Quantity)                   AS CantidadTotalComprada,
        MIN(IL.Quantity)                   AS CantidadMinimaPorLinea,
        MAX(IL.Quantity)                   AS CantidadMaximaPorLinea
    FROM Vta_LineasFactura AS IL
    JOIN Vta_Facturas AS I  ON I.InvoiceID = IL.InvoiceID
    JOIN Cli_Clientes AS C  ON C.CustomerID = I.CustomerID
    WHERE I.IsCreditNote = 0
      AND (@Anio IS NULL OR YEAR(I.InvoiceDate) = @Anio)
      AND (@Mes  IS NULL OR MONTH(I.InvoiceDate) = @Mes)
      AND (@Categoria IS NULL OR EXISTS (
              SELECT 1
              FROM Inv_ArticuloGrupo AS AG
              JOIN Inv_GruposArticulo AS SG ON SG.StockGroupID = AG.StockGroupID
              WHERE AG.StockItemID = IL.StockItemID
                AND SG.StockGroupName = @Categoria
          ))
      AND (@Subcategoria IS NULL OR EXISTS (
              SELECT 1
              FROM Inv_ArticuloGrupo AS AG
              JOIN Inv_GruposArticulo AS SG ON SG.StockGroupID = AG.StockGroupID
              WHERE AG.StockItemID = IL.StockItemID
                AND SG.StockGroupName = @Subcategoria
          ))
    GROUP BY C.CustomerID, C.CustomerName, YEAR(I.InvoiceDate), MONTH(I.InvoiceDate)
    ORDER BY C.CustomerName, Anio, Mes;
END
GO


-- ============================================================================
-- Stored Procedure: Rpt_sp_SeguimientoComprasProveedor
-- Descripción: Proporciona un resumen mensual de las compras realizadas a cada proveedor, incluyendo estadísticas de cantidades y montos
-- Uso: Se utiliza para analizar el patrón de compras a proveedores a lo largo del tiempo, permitiendo identificar estacionalidad y comportamiento de aprovisionamiento
-- Parámetros:
--   - @Anio: Filtro opcional por año específico
--   - @Mes: Filtro opcional por mes específico (1-12)
--   - @Categoria: Filtro opcional por categoría de producto
--   - @Subcategoria: Filtro opcional por subcategoría de producto
-- Tablas origen: Cmp_LineasOrdenCompra, Cmp_OrdenesCompra, Prov_Proveedores, Inv_ArticuloGrupo, Inv_GruposArticulo
-- Ordenamiento: Nombre del proveedor ascendente, luego año ascendente, luego mes ascendente
-- Columnas retornadas:
--   - IdProveedor: Identificador único del proveedor
--   - NombreProveedor: Nombre del proveedor
--   - Anio: Año de las compras
--   - Mes: Mes de las compras
--   - PrimeraOrdenDelMes: Fecha de la primera orden de compra del mes
--   - UltimaOrdenDelMes: Fecha de la última orden de compra del mes
--   - MontoTotalComprado: Suma total del monto comprado en el mes
--   - CantidadTotalComprada: Suma total de unidades compradas en el mes
--   - CantidadMinimaPorLinea: Cantidad mínima en una línea de orden del mes
--   - CantidadMaximaPorLinea: Cantidad máxima en una línea de orden del mes
-- ============================================================================

CREATE OR ALTER PROCEDURE Rpt_sp_SeguimientoComprasProveedor
    @Anio       INT           = NULL,
    @Mes        INT           = NULL,
    @Categoria  NVARCHAR(100) = NULL,
    @Subcategoria NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        P.SupplierID                        AS IdProveedor,
        P.SupplierName                      AS NombreProveedor,
        YEAR(PO.OrderDate)                  AS Anio,
        MONTH(PO.OrderDate)                 AS Mes,
        MIN(PO.OrderDate)                   AS PrimeraOrdenDelMes,
        MAX(PO.OrderDate)                   AS UltimaOrdenDelMes,
        SUM(POL.OrderedOuters * POL.ExpectedUnitPricePerOuter) AS MontoTotalComprado,
        SUM(POL.OrderedOuters)              AS CantidadTotalComprada,
        MIN(POL.OrderedOuters)              AS CantidadMinimaPorLinea,
        MAX(POL.OrderedOuters)              AS CantidadMaximaPorLinea
    FROM Cmp_LineasOrdenCompra AS POL
    JOIN Cmp_OrdenesCompra AS PO ON PO.PurchaseOrderID = POL.PurchaseOrderID
    JOIN Prov_Proveedores AS P   ON P.SupplierID = PO.SupplierID
    WHERE (@Anio IS NULL OR YEAR(PO.OrderDate) = @Anio)
      AND (@Mes  IS NULL OR MONTH(PO.OrderDate) = @Mes)
      AND (@Categoria IS NULL OR EXISTS (
              SELECT 1
              FROM Inv_ArticuloGrupo AS AG
              JOIN Inv_GruposArticulo AS SG ON SG.StockGroupID = AG.StockGroupID
              WHERE AG.StockItemID = POL.StockItemID
                AND SG.StockGroupName = @Categoria
          ))
      AND (@Subcategoria IS NULL OR EXISTS (
              SELECT 1
              FROM Inv_ArticuloGrupo AS AG
              JOIN Inv_GruposArticulo AS SG ON SG.StockGroupID = AG.StockGroupID
              WHERE AG.StockItemID = POL.StockItemID
                AND SG.StockGroupName = @Subcategoria
          ))
    GROUP BY P.SupplierID, P.SupplierName, YEAR(PO.OrderDate), MONTH(PO.OrderDate)
    ORDER BY P.SupplierName, Anio, Mes;
END
GO


-- ============================================================================
-- Stored Procedure: Rpt_sp_RotacionInventario
-- Descripción: Calcula el promedio de días entre ventas consecutivas de cada producto (rotación de inventario), permitiendo identificar productos de movimiento rápido vs lento
-- Uso: Se utiliza para analizar la velocidad de rotación de los productos, ayudando en decisiones de reabastecimiento y gestión de inventario
-- Parámetros:
--   - @Categoria: Filtro opcional por categoría de producto (búsqueda parcial con LIKE)
--   - @Anio: Filtro opcional por año específico
--   - @Proveedor: Filtro opcional por nombre del proveedor (búsqueda parcial con LIKE)
-- Tablas origen: Vta_LineasFactura, Vta_Facturas, Inv_Articulos, Prov_Proveedores, Inv_ArticuloGrupo, Inv_GruposArticulo
-- Ordenamiento: Días promedio de rotación ascendente (productos que rotan más rápido primero)
-- Columnas retornadas:
--   - IdProducto: Identificador único del producto
--   - NombreProducto: Nombre del producto
--   - Categoria: Categoría a la que pertenece el producto
--   - Proveedor: Proveedor del producto
--   - DiasPromedioRotacion: Promedio de días entre ventas consecutivas del producto (menor = rotación más rápida)
-- ============================================================================

CREATE OR ALTER PROCEDURE Rpt_sp_RotacionInventario
    @Categoria  NVARCHAR(100) = NULL,
    @Anio       INT           = NULL,
    @Proveedor  NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    WITH VentasProducto AS (
        SELECT
            SI.StockItemID,
            SI.StockItemName    AS NombreProducto,
            SG.StockGroupName   AS Categoria,
            PR.SupplierName     AS Proveedor,
            I.InvoiceDate,
            LAG(I.InvoiceDate) OVER (PARTITION BY SI.StockItemID ORDER BY I.InvoiceDate) AS FechaVentaAnterior
        FROM Vta_LineasFactura AS IL
        JOIN Vta_Facturas AS I       ON I.InvoiceID = IL.InvoiceID
        JOIN Inv_Articulos AS SI     ON SI.StockItemID = IL.StockItemID
        JOIN Prov_Proveedores AS PR  ON PR.SupplierID = SI.SupplierID
        OUTER APPLY (
            SELECT TOP 1 SG2.StockGroupName
            FROM Inv_ArticuloGrupo AG2
            JOIN Inv_GruposArticulo SG2 ON SG2.StockGroupID = AG2.StockGroupID
            WHERE AG2.StockItemID = SI.StockItemID
            ORDER BY SG2.StockGroupName
        ) AS SG
        WHERE (@Anio      IS NULL OR YEAR(I.InvoiceDate) = @Anio)
          AND (@Categoria IS NULL OR SG.StockGroupName LIKE '%' + @Categoria + '%')
          AND (@Proveedor IS NULL OR PR.SupplierName LIKE '%' + @Proveedor + '%')
    )
    SELECT
        StockItemID       AS IdProducto,
        NombreProducto,
        Categoria,
        Proveedor,
        AVG(DATEDIFF(DAY, FechaVentaAnterior, InvoiceDate) * 1.0) AS DiasPromedioRotacion
    FROM VentasProducto
    WHERE FechaVentaAnterior IS NOT NULL
    GROUP BY StockItemID, NombreProducto, Categoria, Proveedor
    ORDER BY DiasPromedioRotacion ASC;
END
GO


-- ============================================================================
-- Stored Procedure: Rpt_sp_MetodoEnvioFavoritoPorZona
-- Descripción: Identifica el método de envío más utilizado en cada zona (ciudad de entrega), basado en la cantidad de ventas
-- Uso: Se utiliza para analizar preferencias de envío por zona geográfica, permitiendo optimizar la logística y negociar con transportistas
-- Parámetros:
--   - @Anio: Filtro opcional por año específico
--   - @Mes: Filtro opcional por mes específico (1-12)
--   - @CategoriaCliente: Filtro opcional por categoría de cliente (búsqueda parcial con LIKE)
--   - @CategoriaProducto: Filtro opcional por categoría de producto (búsqueda parcial con LIKE)
--   - @Producto: Filtro opcional por nombre de producto (búsqueda parcial con LIKE)
-- Tablas origen: Vta_Facturas, Cli_Clientes, Gen_Ciudades, Gen_MetodosEntrega, Cli_CategoriasCliente, Vta_LineasFactura, Inv_Articulos, Inv_ArticuloGrupo, Inv_GruposArticulo
-- Ordenamiento: Cantidad de ventas descendente (zonas con mayor volumen primero)
-- Columnas retornadas:
--   - Zona: Nombre de la ciudad (zona de entrega)
--   - MetodoEnvioFavorito: Nombre del método de envío más utilizado en la zona
--   - CantidadVentas: Cantidad de ventas realizadas con ese método de envío en la zona
-- ============================================================================

CREATE OR ALTER PROCEDURE Rpt_sp_MetodoEnvioFavoritoPorZona
    @Anio             INT           = NULL,
    @Mes              INT           = NULL,
    @CategoriaCliente NVARCHAR(100) = NULL,
    @CategoriaProducto NVARCHAR(100) = NULL,
    @Producto         NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    WITH VentasPorZonaMetodo AS (
        SELECT
            CIU.CityName                AS Zona,
            DM.DeliveryMethodName       AS MetodoEnvio,
            COUNT(DISTINCT I.InvoiceID) AS CantidadVentas
        FROM Vta_Facturas AS I
        JOIN Cli_Clientes AS C              ON C.CustomerID = I.CustomerID
        JOIN Gen_Ciudades AS CIU            ON CIU.CityID = C.DeliveryCityID
        JOIN Gen_MetodosEntrega AS DM       ON DM.DeliveryMethodID = I.DeliveryMethodID
        JOIN Cli_CategoriasCliente AS CC    ON CC.CustomerCategoryID = C.CustomerCategoryID
        JOIN Vta_LineasFactura AS IL        ON IL.InvoiceID = I.InvoiceID
        JOIN Inv_Articulos AS SI            ON SI.StockItemID = IL.StockItemID
        LEFT JOIN Inv_ArticuloGrupo AS AG   ON AG.StockItemID = SI.StockItemID
        LEFT JOIN Inv_GruposArticulo AS SG  ON SG.StockGroupID = AG.StockGroupID
        WHERE I.IsCreditNote = 0
          AND (@Anio              IS NULL OR YEAR(I.InvoiceDate) = @Anio)
          AND (@Mes               IS NULL OR MONTH(I.InvoiceDate) = @Mes)
          AND (@CategoriaCliente  IS NULL OR CC.CustomerCategoryName LIKE '%' + @CategoriaCliente + '%')
          AND (@CategoriaProducto IS NULL OR SG.StockGroupName LIKE '%' + @CategoriaProducto + '%')
          AND (@Producto          IS NULL OR SI.StockItemName LIKE '%' + @Producto + '%')
        GROUP BY CIU.CityName, DM.DeliveryMethodName
    ),
    Ranking AS (
        SELECT
            Zona,
            MetodoEnvio,
            CantidadVentas,
            ROW_NUMBER() OVER (PARTITION BY Zona ORDER BY CantidadVentas DESC) AS Posicion
        FROM VentasPorZonaMetodo
    )
    SELECT 
        Zona, 
        MetodoEnvio AS MetodoEnvioFavorito, 
        CantidadVentas
    FROM Ranking
    WHERE Posicion = 1
    ORDER BY CantidadVentas DESC;
END
GO