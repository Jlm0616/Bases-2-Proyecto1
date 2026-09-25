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
            SELECT SUM(POL.OrderedOuters * POL.ExpectedUnitPricePerOuter) AS MontoTotal
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