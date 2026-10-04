const { sql, conectarBD } = require('../config/db');

/**
 * Lista ventas con filtros opcionales y paginación
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.body - Cuerpo de la solicitud
 * @param {string} [req.body.nombreCliente] - Nombre del cliente para filtrar
 * @param {string} [req.body.fechaInicio] - Fecha de inicio del filtro
 * @param {string} [req.body.fechaFin] - Fecha de fin del filtro
 * @param {number} [req.body.montoMinimo] - Monto mínimo del filtro
 * @param {number} [req.body.montoMaximo] - Monto máximo del filtro
 * @param {number} [req.body.page] - Número de página (default: 1)
 * @param {number} [req.body.pageSize] - Tamaño de página (default: 50)
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Devuelve array de ventas con información de paginación
 */
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
    } = req.body;

    const pageNumber = Math.max(1, Number(page));
    const pageSizeNumber = Math.min(
      500,
      Math.max(1, Number(pageSize))
    );

    const conexion = await conectarBD();

    // Consulta paginada
    const resultado = await conexion
      .request()
      .input('NombreCliente', sql.NVarChar(100), nombreCliente)
      .input('FechaInicio', sql.Date, fechaInicio)
      .input('FechaFin', sql.Date, fechaFin)
      .input('MontoMinimo', sql.Decimal(18, 2), montoMinimo)
      .input('MontoMaximo', sql.Decimal(18, 2), montoMaximo)
      .input('PageNumber', sql.Int, pageNumber)
      .input('PageSize', sql.Int, pageSizeNumber)
      .execute('Vta_sp_ListarVentas');

    // Total de filas
    const resultadoTotal = await conexion
      .request()
      .input('NombreCliente', sql.NVarChar(100), nombreCliente)
      .input('FechaInicio', sql.Date, fechaInicio)
      .input('FechaFin', sql.Date, fechaFin)
      .input('MontoMinimo', sql.Decimal(18, 2), montoMinimo)
      .input('MontoMaximo', sql.Decimal(18, 2), montoMaximo)
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

/**
 * Obtiene el detalle de una venta específica
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.id - ID de la factura
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Devuelve el detalle de la venta con encabezado y líneas
 */
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

/**
 * Inserta una nueva venta en el sistema
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.body - Cuerpo de la solicitud con datos de la venta
 * @param {number} req.body.idCliente - ID del cliente
 * @param {number} req.body.idPersonaContacto - ID de persona de contacto
 * @param {number} req.body.idVendedor - ID del vendedor
 * @param {number} req.body.idEditadoPor - ID de usuario que edita
 * @param {number} req.body.idMetodoEntrega - ID de método de entrega
 * @param {number} req.body.idPersonaCuentas - ID de persona de cuentas
 * @param {number} req.body.idPersonaEmpacadora - ID de persona empacadora
 * @param {string} [req.body.numeroOrdenCompra] - Número de orden de compra
 * @param {string} [req.body.instruccionesEntrega] - Instrucciones de entrega
 * @param {Array} req.body.lineas - Array de líneas de la venta
 * @param {number} req.body.lineas[].idProducto - ID del producto
 * @param {number} req.body.lineas[].cantidad - Cantidad del producto
 * @param {number} req.body.lineas[].precioUnitario - Precio unitario
 * @param {number} req.body.lineas[].idTipoEmpaque - ID de tipo de empaque
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Devuelve el ID de la nueva venta
 */
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
        linea.idTipoEmpaque
      );
    }

    const solicitud = conexion.request();

    solicitud
      .input('CustomerID', sql.Int, idCliente)
      .input('ContactPersonID', sql.Int, idPersonaContacto)
      .input('SalespersonPersonID', sql.Int, idVendedor)
      .input('LastEditedBy', sql.Int, idEditadoPor)
      .input('DeliveryMethodID', sql.Int, idMetodoEntrega)
      .input('AccountsPersonID', sql.Int, idPersonaCuentas)
      .input('PackedByPersonID', sql.Int, idPersonaEmpacadora)
      .input('CustomerPONumber', sql.NVarChar(20), numeroOrdenCompra)
      .input('DeliveryInstructions', sql.NVarChar(100), instruccionesEntrega)
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

/**
 * Actualiza una venta existente
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.id - ID de la venta a actualizar
 * @param {Object} req.body - Cuerpo de la solicitud con datos a actualizar
 * @param {string} [req.body.instruccionesEntrega] - Instrucciones de entrega
 * @param {string} [req.body.numeroOrdenCompra] - Número de orden de compra
 * @param {number} req.body.idEditadoPor - ID de usuario que edita
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Devuelve la venta actualizada
 */
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
      .input('DeliveryInstructions', sql.NVarChar(100), instruccionesEntrega)
      .input('CustomerPONumber', sql.NVarChar(20), numeroOrdenCompra)
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

/**
 * Elimina una venta del sistema
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.id - ID de la venta a eliminar
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Devuelve el resultado de la eliminación
 */
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