const { conectarBD } = require("../config/db");

/**
 * Lista las categorías de clientes disponibles para filtros
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Devuelve array de categorías de clientes
 */
async function listarCategoriasCliente(req, res) {
  try {
    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .execute("Flt_sp_ListarCategoriasCliente");

    res.json(resultado.recordset);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al listar categorías de clientes",
      error: error.message,
    });
  }
}

/**
 * Lista los métodos de entrega disponibles para filtros
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Devuelve array de métodos de entrega
 */
async function listarMetodosEntrega(req, res) {
  try {
    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .execute("Flt_sp_ListarMetodosEntrega");

    res.json(resultado.recordset);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al listar métodos de entrega",
      error: error.message,
    });
  }
}

/**
 * Lista las categorías de proveedores disponibles para filtros
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Devuelve array de categorías de proveedores
 */
async function listarCategoriasProveedor(req, res) {
  try {
    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .execute("Flt_sp_ListarCategoriasProveedor");

    res.json(resultado.recordset);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al listar categorías de proveedores",
      error: error.message,
    });
  }
}

/**
 * Lista los grupos de productos disponibles para filtros
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Devuelve array de grupos de productos
 */
async function listarGruposProductos(req, res) {
  try {
    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .execute("Flt_sp_ListarGruposProductos");

    res.json(resultado.recordset);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al listar grupos de productos",
      error: error.message,
    });
  }
}

/**
 * Lista las personas disponibles para filtros
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Devuelve array de personas
 */
async function listarPersonas(req, res) {
  try {
    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .execute("Flt_sp_ListarPersonas");

    res.json(resultado.recordset);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al listar personas",
      error: error.message,
    });
  }
}

/**
 * Lista las ciudades disponibles para filtros
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Devuelve array de ciudades
 */
async function listarCiudades(req, res) {
  try {
    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .execute("Flt_sp_ListarCiudades");

    res.json(resultado.recordset);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al listar ciudades",
      error: error.message,
    });
  }
}

/**
 * Lista los grupos de compra disponibles para filtros
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Devuelve array de grupos de compra
 */
async function listarGruposCompra(req, res) {
  try {
    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .execute("Flt_sp_ListarGruposCompra");

    res.json(resultado.recordset);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al listar grupos de compra",
      error: error.message,
    });
  }
}

/**
 * Lista los años de ventas disponibles para filtros
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Devuelve array de años de ventas
 */
async function listarAniosVentas(req, res) {
  try {
    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .execute("Flt_sp_ListarAniosVentas");

    res.json(resultado.recordset);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al listar años de ventas",
      error: error.message,
    });
  }
}

/**
 * Lista los años de compras disponibles para filtros
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Devuelve array de años de compras
 */
async function listarAniosCompras(req, res) {
  try {
    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .execute("Flt_sp_ListarAniosCompras");

    res.json(resultado.recordset);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al listar años de compras",
      error: error.message,
    });
  }
}

/**
 * Lista las categorías de productos disponibles para filtros
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Devuelve array de categorías de productos
 */
async function listarCategoriasProducto(req, res) {
  try {
    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .execute("Flt_sp_ListarCategoriasProducto");

    res.json(resultado.recordset);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al listar categorías de producto",
      error: error.message,
    });
  }
}

/**
 * Lista los proveedores disponibles para filtros
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Devuelve array de proveedores
 */
async function listarProveedores(req, res) {
  try {
    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .execute("Flt_sp_ListarProveedores");

    res.json(resultado.recordset);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al listar proveedores",
      error: error.message,
    });
  }
}

/**
 * Lista los productos disponibles para filtros
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Devuelve array de productos
 */
async function listarProductos(req, res) {
  try {
    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .execute("Flt_sp_ListarProductos");

    res.json(resultado.recordset);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al listar productos",
      error: error.message,
    });
  }
}

/**
 * Lista las subcategorías de productos disponibles para filtros
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Devuelve array de subcategorías de productos
 */
async function listarSubcategoriasProducto(req, res) {
  try {
    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .execute("Flt_sp_ListarSubcategoriasProducto");

    res.json(resultado.recordset);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al listar subcategorías de producto",
      error: error.message,
    });
  }
}

/**
 * Lista los clientes disponibles para filtros
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Devuelve array de clientes
 */
async function listarClientes(req, res) {
  try {
    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .execute("Flt_sp_ListarClientes");

    res.json(resultado.recordset);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al listar clientes",
      error: error.message,
    });
  }
}

module.exports = {
  listarCategoriasCliente,
  listarMetodosEntrega,
  listarCategoriasProveedor,
  listarGruposProductos,
  listarPersonas,
  listarCiudades,
  listarGruposCompra,
  listarAniosVentas,
  listarAniosCompras,
  listarCategoriasProducto,
  listarProveedores,
  listarProductos,
  listarSubcategoriasProducto,
  listarClientes,
};
