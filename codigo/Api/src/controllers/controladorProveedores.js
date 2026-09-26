const { sql, conectarBD } = require('../config/db');

async function listarProveedores(req, res) {
  try {
    const {
      nombre = null,
      categoriaID = null
    } = req.body;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('Nombre', sql.NVarChar(100), nombre)
      .input('CategoriaID', sql.Int, categoriaID)
      .execute('Prov_sp_ListarProveedores');

    res.json(resultado.recordset);

  } catch (error) {
    console.error('Error al listar proveedores:', error);

    res.status(500).json({
      mensaje: 'Error al listar proveedores',
      error: error.message
    });
  }
}

async function detalleProveedor(req, res) {
  try {
    const idProveedor = req.params.id;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('SupplierID', sql.Int, idProveedor)
      .execute('Prov_sp_DetalleProveedor');

    res.json(resultado.recordset[0]);

  } catch (error) {
    console.error('Error al obtener detalle del proveedor:', error);

    res.status(500).json({
      mensaje: 'Error al obtener detalle del proveedor',
      error: error.message
    });
  }
}

module.exports = {
  listarProveedores,
  detalleProveedor
};
