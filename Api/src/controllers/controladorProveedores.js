const { sql, conectarBD } = require('../config/db');

async function listarProveedores(req, res) {
  try {
    const {
      nombre = null,
      idCategoria = null
    } = { ...(req.body || {}), ...(req.query || {}) };

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('Nombre', sql.NVarChar(100), nombre)
      .input('CategoriaID', sql.Int, idCategoria)
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

async function insertarProveedor(req, res) {
  try {
    const {
      nombreProveedor,
      idCategoria,
      idContactoPrimario,
      idContactoAlternativo,
      idMetodoEntrega,
      idCiudadEntrega,
      idEditadoPor,
      idCiudadPostal,
      telefono,
      direccionEntregaLinea1,
      codigoPostalEntrega,
      direccionPostalLinea1,
      codigoPostal
    } = req.body;

    const conexion = await conectarBD();

    const solicitud = conexion.request();

    solicitud
      .input('NombreProveedor', sql.NVarChar(100), nombreProveedor)
      .input('CategoriaID', sql.Int, idCategoria)
      .input('PrimaryContactID', sql.Int, idContactoPrimario)
      .input('AlternateContactID', sql.Int, idContactoAlternativo)
      .input('MetodoEntregaID', sql.Int, idMetodoEntrega)
      .input('DeliveryCityID', sql.Int, idCiudadEntrega)
      .input('LastEditedBy', sql.Int, idEditadoPor)
      .input('PostalCityID', sql.Int, idCiudadPostal)
      .input('PhoneNumber', sql.NVarChar(20), telefono)
      .input('DeliveryAddressLine1', sql.NVarChar(60), direccionEntregaLinea1)
      .input('DeliveryPostalCode', sql.NVarChar(10), codigoPostalEntrega)
      .input('PostalAddressLine1', sql.NVarChar(60), direccionPostalLinea1)
      .input('PostalPostalCode', sql.NVarChar(10), codigoPostal)
      .output('NuevoID', sql.Int);

    const resultado = await solicitud.execute('Prov_sp_InsertarProveedor');

    res.json({
      idProveedor: resultado.output.NuevoID,
      resultado: resultado.recordset
    });

  } catch (error) {
    console.error('Error al insertar proveedor:', error);

    res.status(500).json({
      mensaje: 'Error al insertar proveedor',
      error: error.message
    });
  }
}

async function actualizarProveedor(req, res) {
  try {
    const idProveedor = req.params.id;

    const {
      nombreProveedor,
      idCategoria,
      idMetodoEntrega,
      idEditadoPor,
      telefono,
      direccionEntregaLinea1,
      codigoPostalEntrega
    } = req.body;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('SupplierID', sql.Int, idProveedor)
      .input('NombreProveedor', sql.NVarChar(100), nombreProveedor)
      .input('CategoriaID', sql.Int, idCategoria)
      .input('MetodoEntregaID', sql.Int, idMetodoEntrega)
      .input('LastEditedBy', sql.Int, idEditadoPor)
      .input('PhoneNumber', sql.NVarChar(20), telefono)
      .input('DeliveryAddressLine1', sql.NVarChar(60), direccionEntregaLinea1)
      .input('DeliveryPostalCode', sql.NVarChar(10), codigoPostalEntrega)
      .execute('Prov_sp_ActualizarProveedor');

    res.json(resultado.recordset[0]);

  } catch (error) {
    console.error('Error al actualizar proveedor:', error);

    res.status(500).json({
      mensaje: 'Error al actualizar proveedor',
      error: error.message
    });
  }
}

async function eliminarProveedor(req, res) {
  try {
    const idProveedor = req.params.id;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('SupplierID', sql.Int, idProveedor)
      .execute('Prov_sp_EliminarProveedor');

    res.json(resultado.recordset[0]);

  } catch (error) {
    console.error('Error al eliminar proveedor:', error);

    res.status(500).json({
      mensaje: 'Error al eliminar proveedor',
      error: error.message
    });
  }
}

module.exports = {
  listarProveedores,
  detalleProveedor,
  insertarProveedor,
  actualizarProveedor,
  eliminarProveedor
};