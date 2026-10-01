const { sql, conectarBD } = require('../config/db');

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
    console.error('Error en reporte de montos de proveedores:', error);

    res.status(500).json({
      mensaje: 'Error en reporte de montos de proveedores',
      error: error.message
    });
  }
}

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
    console.error('Error en reporte de montos de clientes:', error);

    res.status(500).json({
      mensaje: 'Error en reporte de montos de clientes',
      error: error.message
    });
  }
}

async function top5ProductosGanancia(req, res) {
  try {
    const { año } = req.body;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('Anio', sql.Int, año)
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
      añoInicio,
      añoFin
    } = req.body;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('AnioInicio', sql.Int, añoInicio)
      .input('AnioFin', sql.Int, añoFin)
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
      añoInicio,
      añoFin
    } = req.body;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('AnioInicio', sql.Int, añoInicio)
      .input('AnioFin', sql.Int, añoFin)
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

async function matrizVentasPorCategoria(req, res) {
  try {
    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .execute('Rpt_sp_MatrizVentasPorCategoria');

    res.json(resultado.recordset);

  } catch (error) {
    console.error('Error en matriz de ventas por categoría:', error);

    res.status(500).json({
      mensaje: 'Error en matriz de ventas por categoría',
      error: error.message
    });
  }
}

async function seguimientoComprasCliente(req, res) {
  try {
    const {
      año,
      mes,
      categoria
    } = req.body;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('Anio', sql.Int, año)
      .input('Mes', sql.Int, mes)
      .input('Categoria', sql.NVarChar(100), categoria)
      .execute('Rpt_sp_SeguimientoComprasCliente');

    res.json(resultado.recordset);

  } catch (error) {
    console.error('Error en seguimiento de compras de clientes:', error);

    res.status(500).json({
      mensaje: 'Error en seguimiento de compras de clientes',
      error: error.message
    });
  }
}

async function seguimientoComprasProveedor(req, res) {
  try {
    const {
      año,
      mes,
      categoria
    } = req.body;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('Anio', sql.Int, año)
      .input('Mes', sql.Int, mes)
      .input('Categoria', sql.NVarChar(100), categoria)
      .execute('Rpt_sp_SeguimientoComprasProveedor');

    res.json(resultado.recordset);

  } catch (error) {
    console.error('Error en seguimiento de compras de proveedores:', error);

    res.status(500).json({
      mensaje: 'Error en seguimiento de compras de proveedores',
      error: error.message
    });
  }
}

async function rotacionInventario(req, res) {
  try {
    const {
      categoria,
      año,
      proveedor
    } = req.body;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('Categoria', sql.NVarChar(100), categoria)
      .input('Anio', sql.Int, año)
      .input('Proveedor', sql.NVarChar(100), proveedor)
      .execute('Rpt_sp_RotacionInventario');

    res.json(resultado.recordset);

  } catch (error) {
    console.error('Error en reporte de rotación de inventario:', error);

    res.status(500).json({
      mensaje: 'Error en reporte de rotación de inventario',
      error: error.message
    });
  }
}

async function metodoEnvioFavoritoPorZona(req, res) {
  try {
    const {
      año,
      mes,
      categoriaCliente,
      categoriaProducto,
      producto
    } = req.body;

    const conexion = await conectarBD();

    const resultado = await conexion
      .request()
      .input('Anio', sql.Int, año)
      .input('Mes', sql.Int, mes)
      .input('CategoriaCliente', sql.NVarChar(100), categoriaCliente)
      .input('CategoriaProducto', sql.NVarChar(100), categoriaProducto)
      .input('Producto', sql.NVarChar(100), producto)
      .execute('Rpt_sp_MetodoEnvioFavoritoPorZona');

    res.json(resultado.recordset);

  } catch (error) {
    console.error('Error en reporte de método de envío favorito:', error);

    res.status(500).json({
      mensaje: 'Error en reporte de método de envío favorito',
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