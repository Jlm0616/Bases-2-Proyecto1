import URL_API from "./api";

/**
 * Busca ventas según los filtros proporcionados
 * @param {Object} filtros - Objeto con los filtros de búsqueda
 * @returns {Promise<Object>} Lista de ventas que coinciden con los filtros
 */
export async function buscarVentas(filtros) {
  const respuesta = await fetch(`${URL_API}/ventas/buscar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filtros),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al buscar ventas");
  }

  return datos;
}

/**
 * Obtiene el detalle de una venta específica
 * @param {number} id - ID de la venta a consultar
 * @returns {Promise<Object>} Información detallada de la venta
 */
export async function obtenerDetalleVenta(id) {
  const respuesta = await fetch(`${URL_API}/ventas/${id}`);

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al obtener el detalle de la venta");
  }

  return datos;
}

/**
 * Crea una nueva venta
 * @param {Object} datos - Datos de la venta a crear
 * @returns {Promise<Object>} Venta creada con su ID
 */
export async function crearVenta(datos) {
  const respuesta = await fetch(`${URL_API}/ventas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  const datosRespuesta = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al crear la venta");
  }

  return datosRespuesta;
}

/**
 * Actualiza los datos de una venta existente
 * @param {number} id - ID de la venta a actualizar
 * @param {Object} datos - Nuevos datos de la venta
 * @returns {Promise<Object>} Venta actualizada
 */
export async function actualizarVenta(id, datos) {
  const respuesta = await fetch(`${URL_API}/ventas/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  const datosRespuesta = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al actualizar la venta");
  }

  return datosRespuesta;
}

/**
 * Elimina una venta existente
 * @param {number} id - ID de la venta a eliminar
 * @returns {Promise<Object>} Confirmación de eliminación
 */
export async function eliminarVenta(id) {
  const respuesta = await fetch(`${URL_API}/ventas/${id}`, {
    method: "DELETE",
  });

  const datosRespuesta = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al eliminar la venta");
  }

  return datosRespuesta;
}

// Catálogos para el formulario de nueva venta

/**
 * Obtiene la lista de clientes para el formulario de ventas
 * @returns {Promise<Object>} Lista de clientes
 */
export async function obtenerClientes() {
  const respuesta = await fetch(`${URL_API}/clientes/buscar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nombre: "", idCategoria: null, idMetodoEntrega: null }),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al obtener clientes");
  }

  return datos;
}

/**
 * Obtiene la lista de personas para el formulario de ventas
 * @returns {Promise<Object>} Lista de personas
 */
export async function obtenerPersonas() {
  const respuesta = await fetch(`${URL_API}/filtros/personas`);
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al obtener personas");
  }

  return datos;
}

/**
 * Obtiene los métodos de entrega para el formulario de ventas
 * @returns {Promise<Object>} Lista de métodos de entrega
 */
export async function obtenerMetodosEntrega() {
  const respuesta = await fetch(`${URL_API}/filtros/metodos-entrega`);
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al obtener métodos de entrega");
  }

  return datos;
}

/**
 * Obtiene la lista de productos para el formulario de ventas
 * @returns {Promise<Object>} Lista de productos
 */
export async function obtenerProductos() {
  const respuesta = await fetch(`${URL_API}/filtros/productos`);

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.error || datos.mensaje || "Error al obtener productos"
    );
  }

  return datos;
}