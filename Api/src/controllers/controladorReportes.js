const { sql, conectarBD } = require('../config/db');

async function montosProveedores(req, res) {
  try {
    const {
      nombreProveedor = null,
      categoria = null
    } = req.body;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('NombreProveedor', sql.NVarChar(100), nombreProveedor)
      .input('Categoria', sql.NVarChar(100), categoria)
      .execute('Rpt_sp_MontosProveedores');

    res.json(resultado.recordset);

  } catch (error) {
    console.error('Error en reporte de montos por proveedor:', error);

    res.status(500).json({
      mensaje: 'Error en reporte de montos por proveedor',
      error: error.message
    });
  }
}

async function montosClientes(req, res) {
  try {
    const {
      nombreCliente = null,
      categoria = null
    } = req.body;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('NombreCliente', sql.NVarChar(100), nombreCliente)
      .input('Categoria', sql.NVarChar(100), categoria)
      .execute('Rpt_sp_MontosClientes');

    res.json(resultado.recordset);

  } catch (error) {
    console.error('Error en reporte de montos por cliente:', error);

    res.status(500).json({
      mensaje: 'Error en reporte de montos por cliente',
      error: error.message
    });
  }
}

async function top5ProductosGanancia(req, res) {
  try {
    const { anio = null } = req.body;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('Anio', sql.Int, anio)
      .execute('Rpt_sp_Top5ProductosPorGanancia');

    res.json(resultado.recordset);

  } catch (error) {
    console.error('Error en top 5 de productos:', error);

    res.status(500).json({
      mensaje: 'Error en top 5 de productos',
      error: error.message
    });
  }
}

async function top5ClientesFacturas(req, res) {
  try {
    const {
      anioInicio = null,
      anioFin = null
    } = req.body;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('AnioInicio', sql.Int, anioInicio)
      .input('AnioFin', sql.Int, anioFin)
      .execute('Rpt_sp_Top5ClientesPorFacturas');

    res.json(resultado.recordset);

  } catch (error) {
    console.error('Error en top 5 de clientes:', error);

    res.status(500).json({
      mensaje: 'Error en top 5 de clientes',
      error: error.message
    });
  }
}

async function top5ProveedoresOrdenes(req, res) {
  try {
    const {
      anioInicio = null,
      anioFin = null
    } = req.body;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('AnioInicio', sql.Int, anioInicio)
      .input('AnioFin', sql.Int, anioFin)
      .execute('Rpt_sp_Top5ProveedoresPorOrdenes');

    res.json(resultado.recordset);

  } catch (error) {
    console.error('Error en top 5 de proveedores:', error);

    res.status(500).json({
      mensaje: 'Error en top 5 de proveedores',
      error: error.message
    });
  }
}

module.exports = {
  montosProveedores,
  montosClientes,
  top5ProductosGanancia,
  top5ClientesFacturas,
  top5ProveedoresOrdenes
};
