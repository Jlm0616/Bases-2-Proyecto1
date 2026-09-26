const { sql, conectarBD } = require('../config/db');

async function listarProductos(req, res) {
  try {
    const {
      nombre = null,
      grupoID = null
    } = req.body;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('Nombre', sql.NVarChar(100), nombre)
      .input('GrupoID', sql.Int, grupoID)
      .execute('Inv_sp_ListarProductos');

    res.json(resultado.recordset);

  } catch (error) {
    console.error('Error al listar productos:', error);

    res.status(500).json({
      mensaje: 'Error al listar productos',
      error: error.message
    });
  }
}

async function detalleProducto(req, res) {
  try {
    const idProducto = req.params.id;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('StockItemID', sql.Int, idProducto)
      .execute('Inv_sp_DetalleProducto');

    res.json(resultado.recordset[0]);

  } catch (error) {
    console.error('Error al obtener detalle del producto:', error);

    res.status(500).json({
      mensaje: 'Error al obtener detalle del producto',
      error: error.message
    });
  }
}

module.exports = {
  listarProductos,
  detalleProducto
};
