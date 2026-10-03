const { sql, conectarBD } = require('../config/db');

async function listarProductos(req, res) {
  try {
    const {
      nombre = null,
      idGrupo = null
    } = { ...(req.body || {}), ...(req.query || {}) };

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('Nombre', sql.NVarChar(100), nombre)
      .input('GrupoID', sql.Int, idGrupo)
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

async function insertarProducto(req, res) {
  try {
    const {
      nombreProducto,
      idProveedor,
      idEmpaqueUnidad,
      idEmpaqueExterior,
      idEditadoPor,
      idColor,
      marca,
      talla,
      diasEntrega,
      cantidadPorEmpaque,
      esRefrigerado,
      impuesto,
      precioUnitario,
      precioVenta,
      peso
    } = req.body;

    const conexion = await conectarBD();

    const solicitud = conexion.request();

    solicitud
      .input('NombreProducto', sql.NVarChar(100), nombreProducto)
      .input('SupplierID', sql.Int, idProveedor)
      .input('UnitPackageID', sql.Int, idEmpaqueUnidad)
      .input('OuterPackageID', sql.Int, idEmpaqueExterior)
      .input('LastEditedBy', sql.Int, idEditadoPor)
      .input('ColorID', sql.Int, idColor)
      .input('Marca', sql.NVarChar(50), marca)
      .input('Talla', sql.NVarChar(20), talla)
      .input('LeadTimeDays', sql.Int, diasEntrega)
      .input('QuantityPerOuter', sql.Int, cantidadPorEmpaque)
      .input('IsChillerStock', sql.Bit, esRefrigerado)
      .input('TaxRate', sql.Decimal(18, 3), impuesto)
      .input('UnitPrice', sql.Decimal(18, 2), precioUnitario)
      .input('PrecioVenta', sql.Decimal(18, 2), precioVenta)
      .input('Peso', sql.Decimal(18, 3), peso)
      .output('NuevoID', sql.Int);

    const resultado = await solicitud.execute('Inv_sp_InsertarProducto');

    res.json({
      idProducto: resultado.output.NuevoID,
      resultado: resultado.recordset
    });

  } catch (error) {
    console.error('Error al insertar producto:', error);

    res.status(500).json({
      mensaje: 'Error al insertar producto',
      error: error.message
    });
  }
}

async function actualizarProducto(req, res) {
  try {
    const idProducto = req.params.id;

    const {
      nombreProducto,
      idProveedor,
      precioUnitario,
      precioVenta,
      impuesto,
      idEditadoPor
    } = req.body;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('StockItemID', sql.Int, idProducto)
      .input('NombreProducto', sql.NVarChar(100), nombreProducto)
      .input('SupplierID', sql.Int, idProveedor)
      .input('UnitPrice', sql.Decimal(18, 2), precioUnitario)
      .input('PrecioVenta', sql.Decimal(18, 2), precioVenta)
      .input('TaxRate', sql.Decimal(18, 3), impuesto)
      .input('LastEditedBy', sql.Int, idEditadoPor)
      .execute('Inv_sp_ActualizarProducto');

    res.json(resultado.recordset[0]);

  } catch (error) {
    console.error('Error al actualizar producto:', error);

    res.status(500).json({
      mensaje: 'Error al actualizar producto',
      error: error.message
    });
  }
}

async function eliminarProducto(req, res) {
  try {
    const idProducto = req.params.id;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('StockItemID', sql.Int, idProducto)
      .execute('Inv_sp_EliminarProducto');

    res.json(resultado.recordset[0]);

  } catch (error) {
    console.error('Error al eliminar producto:', error);

    res.status(500).json({
      mensaje: 'Error al eliminar producto',
      error: error.message
    });
  }
}

module.exports = {
  listarProductos,
  detalleProducto,
  insertarProducto,
  actualizarProducto,
  eliminarProducto
};