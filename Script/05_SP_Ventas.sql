USE WideWorldImporters;
GO

-- ============================================================================
-- 05_SP_Ventas.sql
-- Stored Procedures de Ventas - Proyecto 1 Bases de Datos 2
--
-- Descripción:
--   Contiene los procedimientos almacenados para la gestión de ventas,
--   incluyendo listado con filtros, paginación, conteo total y detalle completo.
-- ============================================================================

-- ============================================================================
-- Stored Procedure: Vta_sp_ListarVentas
-- Descripción: Lista ventas con filtros acumulativos y paginación
-- Uso: Consulta de ventas con filtros de búsqueda flexibles y paginación
-- Parámetros:
--   @NombreCliente: Filtro por nombre del cliente (búsqueda parcial, LIKE)
--   @FechaInicio: Filtro por fecha de factura (desde)
--   @FechaFin: Filtro por fecha de factura (hasta)
--   @MontoMinimo: Filtro por monto mínimo de factura
--   @MontoMaximo: Filtro por monto máximo de factura
--   @PageNumber: Número de página a mostrar (por defecto: 1)
--   @PageSize: Cantidad de registros por página (por defecto: 50, máximo: 500)
-- Ordenamiento: Nombre del cliente ascendente, número de factura ascendente
-- Columnas retornadas:
--   - NumeroFactura: Número de la factura
--   - FechaFactura: Fecha de la factura
--   - NombreCliente: Nombre del cliente
--   - MetodoEntrega: Método de entrega
--   - MontoFactura: Monto total de la factura
-- ============================================================================
CREATE OR ALTER PROCEDURE Vta_sp_ListarVentas
    @NombreCliente   NVARCHAR(100)  = NULL,
    @FechaInicio     DATE           = NULL,
    @FechaFin        DATE           = NULL,
    @MontoMinimo     DECIMAL(18,2)  = NULL,
    @MontoMaximo     DECIMAL(18,2)  = NULL,
    @PageNumber      INT            = 1,
    @PageSize        INT            = 50
AS
BEGIN
    SET NOCOUNT ON;

    -- Sanitizar parámetros
    IF @PageNumber < 1 SET @PageNumber = 1;
    IF @PageSize < 1 SET @PageSize = 50;
    IF @PageSize > 500 SET @PageSize = 500;

    SELECT
        I.InvoiceID                 AS NumeroFactura,
        I.InvoiceDate               AS FechaFactura,
        C.CustomerName              AS NombreCliente,
        DM.DeliveryMethodName       AS MetodoEntrega,
        M.MontoTotal                AS MontoFactura
    FROM Vta_Facturas AS I
    LEFT JOIN Cli_Clientes AS C ON C.CustomerID = I.CustomerID
    LEFT JOIN Gen_MetodosEntrega AS DM ON DM.DeliveryMethodID = I.DeliveryMethodID
    CROSS APPLY (
        SELECT COALESCE(SUM(IL.ExtendedPrice), 0) AS MontoTotal
        FROM Vta_LineasFactura AS IL
        WHERE IL.InvoiceID = I.InvoiceID
    ) AS M
    WHERE (@NombreCliente IS NULL OR C.CustomerName LIKE '%' + @NombreCliente + '%')
      AND (@FechaInicio   IS NULL OR I.InvoiceDate >= @FechaInicio)
      AND (@FechaFin      IS NULL OR I.InvoiceDate <= @FechaFin)
      AND (@MontoMinimo   IS NULL OR M.MontoTotal >= @MontoMinimo)
      AND (@MontoMaximo   IS NULL OR M.MontoTotal <= @MontoMaximo)
    ORDER BY C.CustomerName ASC, I.InvoiceID ASC
    OFFSET (@PageNumber - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END
GO


-- ============================================================================
-- Stored Procedure: Vta_sp_ContarVentas
-- Descripción: Cuenta el total de ventas que cumplen con los filtros
-- Uso: Calcula el total de registros para implementar paginación
-- Parámetros:
--   @NombreCliente: Filtro por nombre del cliente (búsqueda parcial, LIKE)
--   @FechaInicio: Filtro por fecha de factura (desde)
--   @FechaFin: Filtro por fecha de factura (hasta)
--   @MontoMinimo: Filtro por monto mínimo de factura
--   @MontoMaximo: Filtro por monto máximo de factura
-- Columnas retornadas:
--   - Total: Cantidad total de registros que cumplen los filtros
-- ============================================================================
CREATE OR ALTER PROCEDURE Vta_sp_ContarVentas
    @NombreCliente   NVARCHAR(100)  = NULL,
    @FechaInicio     DATE           = NULL,
    @FechaFin        DATE           = NULL,
    @MontoMinimo     DECIMAL(18,2)  = NULL,
    @MontoMaximo     DECIMAL(18,2)  = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT COUNT(*) AS Total
    FROM Vta_Facturas AS I
    LEFT JOIN Cli_Clientes AS C ON C.CustomerID = I.CustomerID
    CROSS APPLY (
        SELECT COALESCE(SUM(IL.ExtendedPrice), 0) AS MontoTotal
        FROM Vta_LineasFactura AS IL
        WHERE IL.InvoiceID = I.InvoiceID
    ) AS M
    WHERE (@NombreCliente IS NULL OR C.CustomerName LIKE '%' + @NombreCliente + '%')
      AND (@FechaInicio   IS NULL OR I.InvoiceDate >= @FechaInicio)
      AND (@FechaFin      IS NULL OR I.InvoiceDate <= @FechaFin)
      AND (@MontoMinimo   IS NULL OR M.MontoTotal >= @MontoMinimo)
      AND (@MontoMaximo   IS NULL OR M.MontoTotal <= @MontoMaximo);
END
GO


-- ============================================================================
-- Stored Procedure: Vta_sp_DetalleVenta
-- Descripción: Obtiene el detalle completo de una venta específica
-- Uso: Cargar datos de una venta para visualización (encabezado + líneas)
-- Parámetros:
--   @InvoiceID: Identificador único de la factura a consultar
-- Columnas retornadas (encabezado):
--   - NumeroFactura: Número de la factura
--   - NombreCliente: Nombre del cliente
--   - MetodoEntrega: Método de entrega
--   - NumeroOrdenCompra: Número de orden de compra del cliente
--   - PersonaContacto: Persona de contacto
--   - NombreVendedor: Nombre del vendedor
--   - FechaFactura: Fecha de la factura
--   - InstruccionesEntrega: Instrucciones de entrega
-- Columnas retornadas (líneas):
--   - NombreProducto: Nombre del producto
--   - Cantidad: Cantidad vendida
--   - PrecioUnitario: Precio unitario
--   - ImpuestoAplicado: Tasa de impuesto aplicada
--   - MontoImpuesto: Monto del impuesto
--   - TotalPorLinea: Total por línea de factura
-- ============================================================================
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
