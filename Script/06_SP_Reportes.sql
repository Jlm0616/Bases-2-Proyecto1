USE WideWorldImporters;
GO

-- ============================================
-- REPORTE 1: Montos altos/bajos/promedio a proveedores
-- Agrupado por proveedor y categoria, con ROLLUP
-- Filtros: nombre proveedor (texto libre), categoria (texto libre)
-- ============================================
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
        SELECT 
            SUM(POL.OrderedOuters * POL.ExpectedUnitPricePerOuter) AS MontoTotal
        FROM Cmp_LineasOrdenCompra AS POL
        WHERE POL.PurchaseOrderID = PO.PurchaseOrderID
    ) AS M
    WHERE (@NombreProveedor IS NULL OR P.SupplierName LIKE '%' + @NombreProveedor + '%')
      AND (@Categoria IS NULL OR PC.SupplierCategoryName LIKE '%' + @Categoria + '%')
    GROUP BY ROLLUP (PC.SupplierCategoryName, P.SupplierName)
    ORDER BY PC.SupplierCategoryName, P.SupplierName;
END
GO

-- ============================================
-- REPORTE 2: Montos altos/bajos/promedio a clientes
-- Agrupado por cliente y categoria, con ROLLUP
-- Filtros: nombre cliente (texto libre), categoria (texto libre)
-- ============================================
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
        SELECT 
            SUM(IL.ExtendedPrice) AS MontoTotal
        FROM Vta_LineasFactura AS IL
        WHERE IL.InvoiceID = I.InvoiceID
    ) AS M
    WHERE (@NombreCliente IS NULL OR C.CustomerName LIKE '%' + @NombreCliente + '%')
      AND (@Categoria IS NULL OR CC.CustomerCategoryName LIKE '%' + @Categoria + '%')
    GROUP BY ROLLUP (CC.CustomerCategoryName, C.CustomerName)
    ORDER BY CC.CustomerCategoryName, C.CustomerName;
END
GO

-- ============================================
-- REPORTE 3: Top 5 productos por ganancia en ventas, por año
-- Filtro: año
-- ============================================
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
        WHERE (@Anio IS NULL OR YEAR(I.InvoiceDate) = @Anio)
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

-- ============================================
-- REPORTE 4: Top 5 clientes por cantidad de facturas, por año
-- Filtro: rango de años
-- ============================================
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
            SELECT SUM(IL.ExtendedPrice) AS MontoTotal
            FROM Vta_LineasFactura AS IL
            WHERE IL.InvoiceID = I.InvoiceID
        ) AS M
        WHERE (@AnioInicio IS NULL OR YEAR(I.InvoiceDate) >= @AnioInicio)
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

-- ============================================
-- REPORTE 5: Top 5 proveedores por cantidad de ordenes de compra, por año
-- Filtro: rango de años
-- ============================================
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
            SELECT 
                SUM(POL.OrderedOuters * POL.ExpectedUnitPricePerOuter) AS MontoTotal
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

-- ============================================
-- REPORTE 6: Matriz de ventas por categoria de producto y año
-- Filas: categoria de producto (StockGroup)
-- Columnas: año
-- ============================================
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
        JOIN Vta_Facturas AS I           ON I.InvoiceID = IL.InvoiceID
        JOIN Inv_ArticuloGrupo AS AG     ON AG.StockItemID = IL.StockItemID
        JOIN Inv_GruposArticulo AS SG    ON SG.StockGroupID = AG.StockGroupID
    ) AS Origen
    PIVOT (
        SUM(Monto) FOR Anio IN ([2013], [2014], [2015], [2016])
    ) AS Matriz
    ORDER BY CategoriaProducto;
END
GO

-- ============================================
-- REPORTE 7: Seguimiento de compras por cliente (resumen mensual)
-- Monto total por mes, primera y ultima factura del mes,
-- cantidad total comprada y cantidad minima/maxima por linea
-- Filtros: año, mes, categoria de producto
-- ============================================
CREATE OR ALTER PROCEDURE Rpt_sp_SeguimientoComprasCliente
    @Anio       INT           = NULL,
    @Mes        INT           = NULL,
    @Categoria  NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        C.CustomerID                       AS IdCliente,
        C.CustomerName                     AS NombreCliente,
        YEAR(I.InvoiceDate)                AS Anio,
        MONTH(I.InvoiceDate)                AS Mes,
        MIN(I.InvoiceDate)                  AS PrimeraFacturaDelMes,
        MAX(I.InvoiceDate)                  AS UltimaFacturaDelMes,
        SUM(IL.ExtendedPrice)               AS MontoTotalComprado,
        SUM(IL.Quantity)                    AS CantidadTotalComprada,
        MIN(IL.Quantity)                    AS CantidadMinimaPorLinea,
        MAX(IL.Quantity)                    AS CantidadMaximaPorLinea
    FROM Vta_LineasFactura AS IL
    JOIN Vta_Facturas AS I            ON I.InvoiceID = IL.InvoiceID
    JOIN Cli_Clientes AS C            ON C.CustomerID = I.CustomerID
    JOIN Inv_ArticuloGrupo AS AG      ON AG.StockItemID = IL.StockItemID
    JOIN Inv_GruposArticulo AS SG     ON SG.StockGroupID = AG.StockGroupID
    WHERE (@Anio      IS NULL OR YEAR(I.InvoiceDate) = @Anio)
      AND (@Mes       IS NULL OR MONTH(I.InvoiceDate) = @Mes)
      AND (@Categoria IS NULL OR SG.StockGroupName LIKE '%' + @Categoria + '%')
    GROUP BY C.CustomerID, C.CustomerName, YEAR(I.InvoiceDate), MONTH(I.InvoiceDate)
    ORDER BY C.CustomerName, Anio, Mes;
END
GO


-- ============================================
-- REPORTE 8: Seguimiento de compras a proveedores (resumen mensual)
-- Monto total por mes, primera y ultima orden del mes,
-- cantidad total comprada y cantidad minima/maxima por linea
-- Filtros: año, mes, categoria de producto
-- ============================================
CREATE OR ALTER PROCEDURE Rpt_sp_SeguimientoComprasProveedor
    @Anio       INT           = NULL,
    @Mes        INT           = NULL,
    @Categoria  NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        P.SupplierID                        AS IdProveedor,
        P.SupplierName                      AS NombreProveedor,
        YEAR(PO.OrderDate)                  AS Anio,
        MONTH(PO.OrderDate)                  AS Mes,
        MIN(PO.OrderDate)                    AS PrimeraOrdenDelMes,
        MAX(PO.OrderDate)                    AS UltimaOrdenDelMes,
        SUM(POL.OrderedOuters * POL.ExpectedUnitPricePerOuter) AS MontoTotalComprado,
        SUM(POL.OrderedOuters)                AS CantidadTotalComprada,
        MIN(POL.OrderedOuters)                AS CantidadMinimaPorLinea,
        MAX(POL.OrderedOuters)                AS CantidadMaximaPorLinea
    FROM Cmp_LineasOrdenCompra AS POL
    JOIN Cmp_OrdenesCompra AS PO      ON PO.PurchaseOrderID = POL.PurchaseOrderID
    JOIN Prov_Proveedores AS P        ON P.SupplierID = PO.SupplierID
    JOIN Inv_ArticuloGrupo AS AG      ON AG.StockItemID = POL.StockItemID
    JOIN Inv_GruposArticulo AS SG     ON SG.StockGroupID = AG.StockGroupID
    WHERE (@Anio      IS NULL OR YEAR(PO.OrderDate) = @Anio)
      AND (@Mes       IS NULL OR MONTH(PO.OrderDate) = @Mes)
      AND (@Categoria IS NULL OR SG.StockGroupName LIKE '%' + @Categoria + '%')
    GROUP BY P.SupplierID, P.SupplierName, YEAR(PO.OrderDate), MONTH(PO.OrderDate)
    ORDER BY P.SupplierName, Anio, Mes;
END
GO

-- ============================================
-- REPORTE 9: Rotacion de inventario promedio por producto
-- Se mide como el promedio de dias transcurridos entre ventas
-- consecutivas del mismo producto (a menor promedio, mayor rotacion)
-- Filtros: categoria, año, proveedor
-- ============================================
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
        JOIN Vta_Facturas AS I         ON I.InvoiceID = IL.InvoiceID
        JOIN Inv_Articulos AS SI       ON SI.StockItemID = IL.StockItemID
        JOIN Prov_Proveedores AS PR    ON PR.SupplierID = SI.SupplierID
        LEFT JOIN Inv_ArticuloGrupo AS AG  ON AG.StockItemID = SI.StockItemID
        LEFT JOIN Inv_GruposArticulo AS SG ON SG.StockGroupID = AG.StockGroupID
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


-- ============================================
-- REPORTE 10: Metodo de envio favorito por zona
-- Zona = ciudad de entrega del cliente
-- Filtros: año, mes, categoria de cliente, categoria de producto, producto
-- ============================================
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
        WHERE (@Anio              IS NULL OR YEAR(I.InvoiceDate) = @Anio)
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