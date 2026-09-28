const { sql, conectarBD } = require('../config/db');

async function listarVentas(req, res) {
  try {
    const {
      nombreCliente = null,
      fechaInicio = null,
      fechaFin = null,
      montoMinimo = null,
      montoMaximo = null
    } = req.body;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('NombreCliente', sql.NVarChar(100), nombreCliente)
      .input('FechaInicio', sql.Date, fechaInicio)
      .input('FechaFin', sql.Date, fechaFin)
      .input('MontoMinimo', sql.Decimal(18, 2), montoMinimo)
      .input('MontoMaximo', sql.Decimal(18, 2), montoMaximo)
      .execute('Vta_sp_ListarVentas');

    res.json(resultado.recordset);

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

module.exports = {
  listarVentas,
  detalleVenta
};
