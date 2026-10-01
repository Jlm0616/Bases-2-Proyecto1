const { sql, conectarBD } = require('../config/db');

async function listarClientes(req, res) {
  try {
    const {
      nombre = null,
      idCategoria = null,
      idMetodoEntrega = null
    } = req.body;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('Nombre', sql.NVarChar(100), nombre)
      .input('CategoriaID', sql.Int, idCategoria)
      .input('MetodoEntregaID', sql.Int, idMetodoEntrega)
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

async function insertarCliente(req, res) {
  try {
    const {
      nombreCliente,
      idCategoria,
      idMetodoEntrega,
      idContactoPrimario,
      idCiudadEntrega,
      idEditadoPor,
      idCiudadPostal,
      idGrupoCompra,
      telefono,
      direccionEntregaLinea1,
      codigoPostalEntrega,
      direccionPostalLinea1,
      codigoPostal
    } = req.body;

    const conexion = await conectarBD();

    const solicitud = conexion.request();

    solicitud
      .input('NombreCliente', sql.NVarChar(100), nombreCliente)
      .input('CategoriaID', sql.Int, idCategoria)
      .input('MetodoEntregaID', sql.Int, idMetodoEntrega)
      .input('PrimaryContactID', sql.Int, idContactoPrimario)
      .input('DeliveryCityID', sql.Int, idCiudadEntrega)
      .input('LastEditedBy', sql.Int, idEditadoPor)
      .input('PostalCityID', sql.Int, idCiudadPostal)
      .input('BuyingGroupID', sql.Int, idGrupoCompra)
      .input('PhoneNumber', sql.NVarChar(20), telefono)
      .input('DeliveryAddressLine1', sql.NVarChar(60), direccionEntregaLinea1)
      .input('DeliveryPostalCode', sql.NVarChar(10), codigoPostalEntrega)
      .input('PostalAddressLine1', sql.NVarChar(60), direccionPostalLinea1)
      .input('PostalPostalCode', sql.NVarChar(10), codigoPostal)
      .output('NuevoID', sql.Int);

    const resultado = await solicitud.execute('Cli_sp_InsertarCliente');

    res.json({
      idCliente: resultado.output.NuevoID,
      resultado: resultado.recordset
    });

  } catch (error) {
    console.error('Error al insertar cliente:', error);

    res.status(500).json({
      mensaje: 'Error al insertar cliente',
      error: error.message
    });
  }
}

async function actualizarCliente(req, res) {
  try {
    const idCliente = req.params.id;

    const {
      nombreCliente,
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
      .input('CustomerID', sql.Int, idCliente)
      .input('NombreCliente', sql.NVarChar(100), nombreCliente)
      .input('CategoriaID', sql.Int, idCategoria)
      .input('MetodoEntregaID', sql.Int, idMetodoEntrega)
      .input('LastEditedBy', sql.Int, idEditadoPor)
      .input('PhoneNumber', sql.NVarChar(20), telefono)
      .input('DeliveryAddressLine1', sql.NVarChar(60), direccionEntregaLinea1)
      .input('DeliveryPostalCode', sql.NVarChar(10), codigoPostalEntrega)
      .execute('Cli_sp_ActualizarCliente');

    res.json(resultado.recordset[0]);

  } catch (error) {
    console.error('Error al actualizar cliente:', error);

    res.status(500).json({
      mensaje: 'Error al actualizar cliente',
      error: error.message
    });
  }
}

async function eliminarCliente(req, res) {
  try {
    const idCliente = req.params.id;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('CustomerID', sql.Int, idCliente)
      .execute('Cli_sp_EliminarCliente');

    res.json(resultado.recordset[0]);

  } catch (error) {
    console.error('Error al eliminar cliente:', error);

    res.status(500).json({
      mensaje: 'Error al eliminar cliente',
      error: error.message
    });
  }
}

module.exports = {
  listarClientes,
  detalleCliente,
  insertarCliente,
  actualizarCliente,
  eliminarCliente
};