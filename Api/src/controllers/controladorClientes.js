const { sql, conectarBD } = require('../config/db');

/**
 * Lista clientes con filtros opcionales
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.body - Cuerpo de la solicitud
 * @param {string} [req.body.nombre] - Nombre del cliente para filtrar
 * @param {number} [req.body.idCategoria] - ID de categoría para filtrar
 * @param {number} [req.body.idMetodoEntrega] - ID de método de entrega para filtrar
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Devuelve array de clientes
 */
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

/**
 * Obtiene el detalle de un cliente específico
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.id - ID del cliente
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Devuelve el detalle del cliente
 */
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

/**
 * Inserta un nuevo cliente en el sistema
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.body - Cuerpo de la solicitud con datos del cliente
 * @param {string} req.body.nombreCliente - Nombre del cliente
 * @param {number} req.body.idCategoria - ID de categoría del cliente
 * @param {number} req.body.idMetodoEntrega - ID de método de entrega
 * @param {number} req.body.idContactoPrimario - ID de persona de contacto
 * @param {number} req.body.idCiudadEntrega - ID de ciudad de entrega
 * @param {number} req.body.idEditadoPor - ID de usuario que edita
 * @param {number} [req.body.idCiudadPostal] - ID de ciudad postal
 * @param {number} [req.body.idGrupoCompra] - ID de grupo de compra
 * @param {string} [req.body.telefono] - Teléfono del cliente
 * @param {string} [req.body.direccionEntregaLinea1] - Dirección de entrega
 * @param {string} [req.body.codigoPostalEntrega] - Código postal de entrega
 * @param {string} [req.body.direccionPostalLinea1] - Dirección postal
 * @param {string} [req.body.codigoPostal] - Código postal
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Devuelve el ID del nuevo cliente
 */
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
      .input('PhoneNumber', sql.NVarChar(20), telefono || 'Sin definir')
      .input('DeliveryAddressLine1', sql.NVarChar(60), direccionEntregaLinea1 || 'Sin definir')
      .input('DeliveryPostalCode', sql.NVarChar(10), codigoPostalEntrega || '00000')
      .input('PostalAddressLine1', sql.NVarChar(60), direccionPostalLinea1 || 'Sin definir')
      .input('PostalPostalCode', sql.NVarChar(10), codigoPostal || '00000')
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

/**
 * Actualiza un cliente existente
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.id - ID del cliente a actualizar
 * @param {Object} req.body - Cuerpo de la solicitud con datos a actualizar
 * @param {string} req.body.nombreCliente - Nombre del cliente
 * @param {number} req.body.idCategoria - ID de categoría del cliente
 * @param {number} req.body.idMetodoEntrega - ID de método de entrega
 * @param {number} req.body.idEditadoPor - ID de usuario que edita
 * @param {number} [req.body.idContactoPrimario] - ID de persona de contacto
 * @param {number} [req.body.idCiudadEntrega] - ID de ciudad de entrega
 * @param {number} [req.body.idCiudadPostal] - ID de ciudad postal
 * @param {number} [req.body.idGrupoCompra] - ID de grupo de compra
 * @param {string} [req.body.telefono] - Teléfono del cliente
 * @param {string} [req.body.direccionEntregaLinea1] - Dirección de entrega
 * @param {string} [req.body.codigoPostalEntrega] - Código postal de entrega
 * @param {string} [req.body.direccionPostalLinea1] - Dirección postal
 * @param {string} [req.body.codigoPostal] - Código postal
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Devuelve el cliente actualizado
 */
async function actualizarCliente(req, res) {
  try {
    const idCliente = req.params.id;

    const {
      nombreCliente,
      idCategoria,
      idMetodoEntrega,
      idEditadoPor,
      idContactoPrimario,
      idCiudadEntrega,
      idCiudadPostal,
      idGrupoCompra,
      telefono,
      direccionEntregaLinea1,
      codigoPostalEntrega,
      direccionPostalLinea1,
      codigoPostal
    } = req.body;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('CustomerID', sql.Int, idCliente)
      .input('NombreCliente', sql.NVarChar(100), nombreCliente)
      .input('CategoriaID', sql.Int, idCategoria)
      .input('MetodoEntregaID', sql.Int, idMetodoEntrega)
      .input('LastEditedBy', sql.Int, idEditadoPor)
      .input('PrimaryContactID', sql.Int, idContactoPrimario)
      .input('DeliveryCityID', sql.Int, idCiudadEntrega)
      .input('PostalCityID', sql.Int, idCiudadPostal)
      .input('BuyingGroupID', sql.Int, idGrupoCompra)
      .input('PhoneNumber', sql.NVarChar(20), telefono || 'Sin definir')
      .input('DeliveryAddressLine1', sql.NVarChar(60), direccionEntregaLinea1 || 'Sin definir')
      .input('DeliveryPostalCode', sql.NVarChar(10), codigoPostalEntrega || '00000')
      .input('PostalAddressLine1', sql.NVarChar(60), direccionPostalLinea1 || 'Sin definir')
      .input('PostalPostalCode', sql.NVarChar(10), codigoPostal || '00000')
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

/**
 * Elimina un cliente del sistema
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.id - ID del cliente a eliminar
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Devuelve el resultado de la eliminación
 */
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