const { conectarBD } = require("../config/db");

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

module.exports = {
  listarCategoriasCliente,
  listarMetodosEntrega,
  listarCategoriasProveedor,
  listarGruposProductos,
  listarPersonas,
  listarCiudades,
  listarGruposCompra,
};
