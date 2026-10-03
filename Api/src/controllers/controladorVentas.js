const { sql, conectarBD } = require('../config/db');

async function listarVentas(req, res) {
  try {
    const {
      nombreCliente,
      fechaInicio,
      fechaFin,
      montoMinimo,
      montoMaximo,
      page = 1,
      pageSize = 50,
    } = { ...(req.body || {}), ...(req.query || {}) };

    const pageNumber = Math.max(1, Number(page) || 1);
    const pageSizeNumber = Math.min(
      500,
      Math.max(1, Number(pageSize) || 50)
    );

    const conexion = await conectarBD();

    // Consulta paginada
    const resultado = await conexion
      .request()
      .input('NombreCliente', sql.NVarChar(100), nombreCliente || null)
      .input('FechaInicio', sql.Date, fechaInicio || null)
      .input('FechaFin', sql.Date, fechaFin || null)
      .input('MontoMinimo', sql.Decimal(18, 2), montoMinimo || null)
      .input('MontoMaximo', sql.Decimal(18, 2), montoMaximo || null)
      .input('PageNumber', sql.Int, pageNumber)
      .input('PageSize', sql.Int, pageSizeNumber)
      .execute('Vta_sp_ListarVentas');

    // Total de filas
    const resultadoTotal = await conexion
      .request()
      .input('NombreCliente', sql.NVarChar(100), nombreCliente || null)
      .input('FechaInicio', sql.Date, fechaInicio || null)
      .input('FechaFin', sql.Date, fechaFin || null)
      .input('MontoMinimo', sql.Decimal(18, 2), montoMinimo || null)
      .input('MontoMaximo', sql.Decimal(18, 2), montoMaximo || null)
      .execute('Vta_sp_ContarVentas');

    const total = resultadoTotal.recordset[0]?.Total ?? 0;

    res.json({
      datos: resultado.recordset,
      total: total,
      page: pageNumber,
      pageSize: pageSizeNumber,
      totalPages: Math.ceil(total / pageSizeNumber),
    });

  } catch (error) {
    console.error('Error al listar ventas:', error);

    res.status(500).json({
      mensaje: 'Error al listar ventas',
      error: error.message
    });
  }
}

async function detalleVenta(req, res) {
  try {
    const idFactura = req.params.id;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('InvoiceID', sql.Int, idFactura)
      .execute('Vta_sp_DetalleVenta');

    res.json({
      encabezado: resultado.recordsets[0][0],
      detalle: resultado.recordsets[1]
    });

  } catch (error) {
    console.error('Error al obtener detalle de la venta:', error);

    res.status(500).json({
      mensaje: 'Error al obtener detalle de la venta',
      error: error.message
    });
  }
}

async function insertarVenta(req, res) {
  try {
    const {
      idCliente,
      idPersonaContacto,
      idVendedor,
      idEditadoPor,
      idMetodoEntrega,
      idPersonaCuentas,
      idPersonaEmpacadora,
      numeroOrdenCompra,
      instruccionesEntrega,
      lineas
    } = req.body;

    const conexion = await conectarBD();

    const tablaLineas = new sql.Table();

    tablaLineas.columns.add('StockItemID', sql.Int);
    tablaLineas.columns.add('Quantity', sql.Int);
    tablaLineas.columns.add('UnitPrice', sql.Decimal(18, 2));
    tablaLineas.columns.add('PackageTypeID', sql.Int);

    for (const linea of lineas) {
      tablaLineas.rows.add(
        linea.idProducto,
        linea.cantidad,
        linea.precioUnitario,
        linea.idTipoEmpaque || null
      );
    }

    const solicitud = conexion.request();

    solicitud
      .input('CustomerID', sql.Int, idCliente)
      .input('ContactPersonID', sql.Int, idPersonaContacto)
      .input('SalespersonPersonID', sql.Int, idVendedor)
      .input('LastEditedBy', sql.Int, idEditadoPor)
      .input('DeliveryMethodID', sql.Int, idMetodoEntrega || 1)
      .input('AccountsPersonID', sql.Int, idPersonaCuentas || null)
      .input('PackedByPersonID', sql.Int, idPersonaEmpacadora || null)
      .input('CustomerPONumber', sql.NVarChar(20), numeroOrdenCompra || null)
      .input('DeliveryInstructions', sql.NVarChar(100), instruccionesEntrega || null)
      .input('Lineas', tablaLineas)
      .output('NuevoID', sql.Int);

    const resultado = await solicitud.execute('Vta_sp_InsertarVenta');

    res.json({
      idVenta: resultado.output.NuevoID,
      resultado: resultado.recordset
    });

  } catch (error) {
    console.error('Error al insertar venta:', error);

    res.status(500).json({
      mensaje: 'Error al insertar venta',
      error: error.message
    });
  }
}

async function actualizarVenta(req, res) {
  try {
    const idVenta = req.params.id;

    const {
      instruccionesEntrega,
      numeroOrdenCompra,
      idEditadoPor
    } = req.body;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('InvoiceID', sql.Int, idVenta)
      .input('DeliveryInstructions', sql.NVarChar(100), instruccionesEntrega || null)
      .input('CustomerPONumber', sql.NVarChar(20), numeroOrdenCompra || null)
      .input('LastEditedBy', sql.Int, idEditadoPor)
      .execute('Vta_sp_ActualizarVenta');

    res.json(resultado.recordset[0]);

  } catch (error) {
    console.error('Error al actualizar venta:', error);

    res.status(500).json({
      mensaje: 'Error al actualizar venta',
      error: error.message
    });
  }
}

async function eliminarVenta(req, res) {
  try {
    const idVenta = req.params.id;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('InvoiceID', sql.Int, idVenta)
      .execute('Vta_sp_EliminarVenta');

    res.json(resultado.recordset[0]);

  } catch (error) {
    console.error('Error al eliminar venta:', error);

    res.status(500).json({
      mensaje: 'Error al eliminar venta',
      error: error.message
    });
  }
}

module.exports = {
  listarVentas,
  detalleVenta,
  insertarVenta,
  actualizarVenta,
  eliminarVenta
};