const { sql, conectarBD } = require('../config/db');

/**
 * Obtiene los montos de proveedores con filtros opcionales
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.body - Cuerpo de la solicitud
 * @param {string} [req.body.nombreProveedor] - Nombre del proveedor para filtrar
 * @param {string} [req.body.categoria] - Categoría para filtrar
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Devuelve array de montos de proveedores
 */
async function montosProveedores(req, res) {
  try {
    const {
      nombreProveedor,
      categoria
    } = req.body;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('NombreProveedor', sql.NVarChar(100), nombreProveedor)
      .input('Categoria', sql.NVarChar(100), categoria)
      .execute('Rpt_sp_MontosProveedores');

    res.json(resultado.recordset);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: 'Error al obtener montos de proveedores',
      error: error.message
    });
  }
}

/**
 * Obtiene los montos de clientes con filtros opcionales
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.body - Cuerpo de la solicitud
 * @param {string} [req.body.nombreCliente] - Nombre del cliente para filtrar
 * @param {string} [req.body.categoria] - Categoría para filtrar
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Devuelve array de montos de clientes
 */
async function montosClientes(req, res) {
  try {
    const {
      nombreCliente,
      categoria
    } = req.body;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('NombreCliente', sql.NVarChar(100), nombreCliente)
      .input('Categoria', sql.NVarChar(100), categoria)
      .execute('Rpt_sp_MontosClientes');

    res.json(resultado.recordset);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: 'Error al obtener montos de clientes',
      error: error.message
    });
  }
}

/**
 * Obtiene el top 5 de productos por ganancia en un año específico
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.body - Cuerpo de la solicitud
 * @param {number} req.body.anio - Año para filtrar
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Devuelve array de los top 5 productos por ganancia
 */
async function top5ProductosGanancia(req, res) {
  try {
    const { anio } = req.body;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('Anio', sql.Int, anio)
      .execute('Rpt_sp_Top5ProductosPorGanancia');

    res.json(resultado.recordset);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: 'Error al obtener top de productos',
      error: error.message
    });
  }
}

/**
 * Obtiene el top 5 de clientes por facturas en un rango de años
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.body - Cuerpo de la solicitud
 * @param {number} req.body.anioInicio - Año de inicio del rango
 * @param {number} req.body.anioFin - Año de fin del rango
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Devuelve array de los top 5 clientes por facturas
 */
async function top5ClientesFacturas(req, res) {
  try {
    const {
      anioInicio,
      anioFin
    } = req.body;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input("AnioInicio", sql.Int, anioInicio)
      .input("AnioFin", sql.Int, anioFin)
      .execute("Rpt_sp_Top5ClientesPorFacturas");

    res.json(resultado.recordset);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al obtener top de clientes",
      error: error.message,
    });
  }
}

/**
 * Obtiene el top 5 de proveedores por órdenes en un rango de años
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.body - Cuerpo de la solicitud
 * @param {number} req.body.anioInicio - Año de inicio del rango
 * @param {number} req.body.anioFin - Año de fin del rango
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Devuelve array de los top 5 proveedores por órdenes
 */
async function top5ProveedoresOrdenes(req, res) {
  try {
    const {
      anioInicio,
      anioFin
    } = req.body;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('AnioInicio', sql.Int, anioInicio)
      .input('AnioFin', sql.Int, anioFin)
      .execute('Rpt_sp_Top5ProveedoresPorOrdenes');

    res.json(resultado.recordset);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: 'Error al obtener top de proveedores',
      error: error.message
    });
  }
}

/**
 * Obtiene la matriz de ventas por categoría
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Devuelve matriz de ventas por categoría
 */
async function matrizVentasPorCategoria(req, res) {
  try {
    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .execute('Rpt_sp_MatrizVentasPorCategoria');

    res.json(resultado.recordset);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: 'Error al obtener matriz de ventas',
      error: error.message
    });
  }
}

/**
 * Obtiene el seguimiento de compras de un cliente por año, mes y categoría
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.body - Cuerpo de la solicitud
 * @param {number} req.body.anio - Año para filtrar
 * @param {number} req.body.mes - Mes para filtrar
 * @param {string} [req.body.categoria] - Categoría para filtrar
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Devuelve array de seguimiento de compras del cliente
 */
async function seguimientoComprasCliente(req, res) {
  try {
    const {
      anio,
      mes,
      categoria
    } = req.body;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('Anio', sql.Int, anio)
      .input('Mes', sql.Int, mes)
      .input('Categoria', sql.NVarChar(100), categoria)
      .execute('Rpt_sp_SeguimientoComprasCliente');

    res.json(resultado.recordset);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: 'Error al obtener seguimiento de clientes',
      error: error.message
    });
  }
}

/**
 * Obtiene el seguimiento de compras de un proveedor por año, mes y categoría
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.body - Cuerpo de la solicitud
 * @param {number} req.body.anio - Año para filtrar
 * @param {number} req.body.mes - Mes para filtrar
 * @param {string} [req.body.categoria] - Categoría para filtrar
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Devuelve array de seguimiento de compras del proveedor
 */
async function seguimientoComprasProveedor(req, res) {
  try {
    const {
      anio,
      mes,
      categoria
    } = req.body;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('Anio', sql.Int, anio)
      .input('Mes', sql.Int, mes)
      .input('Categoria', sql.NVarChar(100), categoria)
      .execute('Rpt_sp_SeguimientoComprasProveedor');

    res.json(resultado.recordset);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: 'Error al obtener seguimiento de proveedores',
      error: error.message
    });
  }
}

/**
 * Obtiene la rotación de inventario con filtros opcionales
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.body - Cuerpo de la solicitud
 * @param {string} [req.body.categoria] - Categoría para filtrar
 * @param {number} [req.body.anio] - Año para filtrar
 * @param {string} [req.body.proveedor] - Proveedor para filtrar
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Devuelve array de rotación de inventario
 */
async function rotacionInventario(req, res) {
  try {
    const {
      categoria,
      anio,
      proveedor
    } = req.body;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('Categoria', sql.NVarChar(100), categoria)
      .input('Anio', sql.Int, anio)
      .input('Proveedor', sql.NVarChar(100), proveedor)
      .execute('Rpt_sp_RotacionInventario');

    res.json(resultado.recordset);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: 'Error al obtener rotación de inventario',
      error: error.message
    });
  }
}

/**
 * Obtiene el método de envío favorito por zona con filtros opcionales
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.body - Cuerpo de la solicitud
 * @param {number} [req.body.anio] - Año para filtrar
 * @param {number} [req.body.mes] - Mes para filtrar
 * @param {string} [req.body.categoriaCliente] - Categoría del cliente para filtrar
 * @param {string} [req.body.categoriaProducto] - Categoría del producto para filtrar
 * @param {string} [req.body.producto] - Producto para filtrar
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Devuelve array de métodos de envío favoritos por zona
 */
async function metodoEnvioFavoritoPorZona(req, res) {
  try {
    const {
      anio,
      mes,
      categoriaCliente,
      categoriaProducto,
      producto
    } = req.body;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('Anio', sql.Int, anio)
      .input('Mes', sql.Int, mes)
      .input('CategoriaCliente', sql.NVarChar(100), categoriaCliente)
      .input('CategoriaProducto', sql.NVarChar(100), categoriaProducto)
      .input('Producto', sql.NVarChar(100), producto)
      .execute('Rpt_sp_MetodoEnvioFavoritoPorZona');

    res.json(resultado.recordset);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: 'Error al obtener método de envío favorito',
      error: error.message
    });
  }
}

module.exports = {
  montosProveedores,
  montosClientes,
  top5ProductosGanancia,
  top5ClientesFacturas,
  top5ProveedoresOrdenes,
  matrizVentasPorCategoria,
  seguimientoComprasCliente,
  seguimientoComprasProveedor,
  rotacionInventario,
  metodoEnvioFavoritoPorZona
};