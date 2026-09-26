USE WideWorldImporters;
GO

-- ============================================
-- SP: Listar ventas con filtros acumulativos
-- Filtros: cliente (texto libre), rango de fechas, rango de monto
-- Orden por defecto: nombre del cliente ascendente
-- ============================================
CREATE OR ALTER PROCEDURE Vta_sp_ListarVentas
    @NombreCliente   NVARCHAR(100)  = NULL,
    @FechaInicio     DATE           = NULL,
    @FechaFin        DATE           = NULL,
    @MontoMinimo     DECIMAL(18,2)  = NULL,
    @MontoMaximo     DECIMAL(18,2)  = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        I.InvoiceID                 AS NumeroFactura,
        I.InvoiceDate               AS FechaFactura,
        C.CustomerName              AS NombreCliente,
        DM.DeliveryMethodName       AS MetodoEntrega,
        M.MontoTotal                AS MontoFactura
    FROM Vta_Facturas AS I
    LEFT JOIN Cli_Clientes AS C     ON C.CustomerID       = I.CustomerID
    LEFT JOIN Gen_MetodosEntrega AS DM ON DM.DeliveryMethodID = I.DeliveryMethodID
    CROSS APPLY (
        SELECT 
            SUM(IL.ExtendedPrice) AS MontoTotal
        FROM Vta_LineasFactura AS IL
        WHERE IL.InvoiceID = I.InvoiceID
    ) AS M
    WHERE (@NombreCliente IS NULL OR C.CustomerName LIKE '%' + @NombreCliente + '%')
      AND (@FechaInicio   IS NULL OR I.InvoiceDate >= @FechaInicio)
      AND (@FechaFin      IS NULL OR I.InvoiceDate <= @FechaFin)
      AND (@MontoMinimo   IS NULL OR M.MontoTotal >= @MontoMinimo)
      AND (@MontoMaximo   IS NULL OR M.MontoTotal <= @MontoMaximo)
    ORDER BY C.CustomerName ASC;
END
GO

-- ============================================
-- SP: Detalle de una venta específica (encabezado + líneas)
-- ============================================
CREATE OR ALTER PROCEDURE Vta_sp_DetalleVenta
    @InvoiceID INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Encabezado
    SELECT
        I.InvoiceID                       AS NumeroFactura,
        C.CustomerName                    AS NombreCliente,
        DM.DeliveryMethodName             AS MetodoEntrega,
        I.CustomerPurchaseOrderNumber     AS NumeroOrdenCompra,
        Contacto.FullName                 AS PersonaContacto,
        Vendedor.FullName                 AS NombreVendedor,
        I.InvoiceDate                     AS FechaFactura,
        I.DeliveryInstructions            AS InstruccionesEntrega
    FROM Vta_Facturas AS I
    LEFT JOIN Cli_Clientes AS C          ON C.CustomerID       = I.CustomerID
    LEFT JOIN Gen_MetodosEntrega AS DM   ON DM.DeliveryMethodID = I.DeliveryMethodID
    LEFT JOIN Gen_Personas AS Contacto   ON Contacto.PersonID  = I.ContactPersonID
    LEFT JOIN Gen_Personas AS Vendedor   ON Vendedor.PersonID  = I.SalespersonPersonID
    WHERE I.InvoiceID = @InvoiceID;

    -- Detalle (líneas)
    SELECT
        SI.StockItemName        AS NombreProducto,
        IL.Quantity              AS Cantidad,
        IL.UnitPrice             AS PrecioUnitario,
        IL.TaxRate               AS ImpuestoAplicado,
        IL.TaxAmount             AS MontoImpuesto,
        IL.ExtendedPrice         AS TotalPorLinea
    FROM Vta_LineasFactura AS IL
    LEFT JOIN Inv_Articulos AS SI ON SI.StockItemID = IL.StockItemID
    WHERE IL.InvoiceID = @InvoiceID;
END
GO