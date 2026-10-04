import URL_API from "./api";

/**
 * Busca productos según los filtros proporcionados
 * @param {Object} filtros - Objeto con los filtros de búsqueda
 * @returns {Promise<Object>} Lista de productos que coinciden con los filtros
 */
export async function buscarProductos(filtros) {
  const respuesta = await fetch(`${URL_API}/productos/buscar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filtros),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al buscar productos");
  }

  return datos;
}

/**
 * Obtiene los grupos de productos disponibles
 * @returns {Promise<Object>} Lista de grupos de productos
 */
export async function obtenerGruposProductos() {
  const respuesta = await fetch(`${URL_API}/filtros/grupos-productos`);

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al obtener grupos de productos");
  }

  return datos;
}

/**
 * Obtiene el detalle de un producto específico
 * @param {number} id - ID del producto a consultar
 * @returns {Promise<Object>} Información detallada del producto
 */
export async function obtenerDetalleProducto(id) {
  const respuesta = await fetch(`${URL_API}/productos/${id}`);

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al obtener el detalle del producto");
  }

  return datos;
}

/**
 * Crea un nuevo producto
 * @param {Object} datos - Datos del producto a crear
 * @returns {Promise<Object>} Producto creado con su ID
 */
export async function crearProducto(datos) {
  const respuesta = await fetch(`${URL_API}/productos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  const datosRespuesta = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al crear el producto");
  }

  return datosRespuesta;
}

/**
 * Actualiza los datos de un producto existente
 * @param {number} id - ID del producto a actualizar
 * @param {Object} datos - Nuevos datos del producto
 * @returns {Promise<Object>} Producto actualizado
 */
export async function actualizarProducto(id, datos) {
  const respuesta = await fetch(`${URL_API}/productos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  const datosRespuesta = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al actualizar el producto");
  }

  return datosRespuesta;
}

/**
 * Elimina un producto existente
 * @param {number} id - ID del producto a eliminar
 * @returns {Promise<Object>} Confirmación de eliminación
 */
export async function eliminarProducto(id) {
  const respuesta = await fetch(`${URL_API}/productos/${id}`, {
    method: "DELETE",
  });

  const datosRespuesta = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al eliminar el producto");
  }

  return datosRespuesta;
}

/**
 * Obtiene la lista de proveedores para el formulario de productos
 * @returns {Promise<Object>} Lista de proveedores
 */
export async function obtenerProveedores() {
  const respuesta = await fetch(`${URL_API}/proveedores/buscar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nombre: "", idCategoria: null }),
  });
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al obtener proveedores");
  }

  return datos;
}

/**
 * Obtiene la lista de colores disponibles
 * @returns {Promise<Object>} Lista de colores
 */
export async function obtenerColores() {
  const respuesta = await fetch(`${URL_API}/filtros/colores`);
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al obtener colores");
  }

  return datos;
}

/**
 * Obtiene los tipos de empaque disponibles
 * @returns {Promise<Object>} Lista de tipos de empaque
 */
export async function obtenerTiposEmpaque() {
  const respuesta = await fetch(`${URL_API}/filtros/tipos-empaque`);
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al obtener tipos de empaque");
  }

  return datos;
}