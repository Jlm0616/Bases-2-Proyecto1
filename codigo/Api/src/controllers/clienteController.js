const { sql, conectarBD } = require('../config/db');

async function listarClientes(req, res) {
  try {
    const {
      nombre = null,
      categoriaID = null,
      metodoEntregaID = null
    } = req.body;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('Nombre', sql.NVarChar(100), nombre)
      .input('CategoriaID', sql.Int, categoriaID)
      .input('MetodoEntregaID', sql.Int, metodoEntregaID)
      .execute('Cli_sp_ListarClientes');

    res.json(resultado.recordset);

  } catch (error) {
    console.error('Error al listar clientes:', error);

    res.status(500).json({
      mensaje: 'Error al listar clientes',
      error: error.message
    });
  }
}

async function detalleCliente(req, res) {
  try {
    const idCliente = req.params.id;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('CustomerID', sql.Int, idCliente)
      .execute('Cli_sp_DetalleCliente');

    res.json(resultado.recordset[0]);

  } catch (error) {
    console.error('Error al obtener detalle del cliente:', error);

    res.status(500).json({
      mensaje: 'Error al obtener detalle del cliente',
      error: error.message
    });
  }
}

module.exports = {
  listarClientes,
  detalleCliente
};