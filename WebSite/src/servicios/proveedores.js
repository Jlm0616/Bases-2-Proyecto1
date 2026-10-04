import URL_API from "./api";

/**
 * Busca proveedores según los filtros proporcionados
 * @param {Object} filtros - Objeto con los filtros de búsqueda
 * @returns {Promise<Object>} Lista de proveedores que coinciden con los filtros
 */
export async function buscarProveedores(filtros) {
  const respuesta = await fetch(`${URL_API}/proveedores/buscar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filtros),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al buscar proveedores");
  }

  return datos;
}

/**
 * Obtiene las categorías de proveedores disponibles
 * @returns {Promise<Object>} Lista de categorías de proveedores
 */
export async function obtenerCategoriasProveedor() {
  const respuesta = await fetch(
    `${URL_API}/filtros/categorias-proveedores`
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al obtener categorías de proveedores");
  }

  return datos;
}

/**
 * Obtiene los métodos de entrega disponibles
 * @returns {Promise<Object>} Lista de métodos de entrega
 */
export async function obtenerMetodosEntrega() {
  const respuesta = await fetch(
    `${URL_API}/filtros/metodos-entrega`
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al obtener métodos de entrega");
  }

  return datos;
}

/**
 * Obtiene el detalle de un proveedor específico
 * @param {number} id - ID del proveedor a consultar
 * @returns {Promise<Object>} Información detallada del proveedor
 */
export async function obtenerDetalleProveedor(id) {
  const respuesta = await fetch(`${URL_API}/proveedores/${id}`);

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al obtener el detalle del proveedor");
  }

  return datos;
}

/**
 * Crea un nuevo proveedor
 * @param {Object} datos - Datos del proveedor a crear
 * @returns {Promise<Object>} Proveedor creado con su ID
 */
export async function crearProveedor(datos) {
  const respuesta = await fetch(`${URL_API}/proveedores`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  const datosRespuesta = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al crear el proveedor");
  }

  return datosRespuesta;
}

/**
 * Actualiza los datos de un proveedor existente
 * @param {number} id - ID del proveedor a actualizar
 * @param {Object} datos - Nuevos datos del proveedor
 * @returns {Promise<Object>} Proveedor actualizado
 */
export async function actualizarProveedor(id, datos) {
  const respuesta = await fetch(`${URL_API}/proveedores/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  const datosRespuesta = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al actualizar el proveedor");
  }

  return datosRespuesta;
}

/**
 * Elimina un proveedor existente
 * @param {number} id - ID del proveedor a eliminar
 * @returns {Promise<Object>} Confirmación de eliminación
 */
export async function eliminarProveedor(id) {
  const respuesta = await fetch(`${URL_API}/proveedores/${id}`, {
    method: "DELETE",
  });

  const datosRespuesta = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al eliminar el proveedor");
  }

  return datosRespuesta;
}

/**
 * Obtiene la lista de personas disponibles
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
 * Obtiene la lista de ciudades disponibles
 * @returns {Promise<Object>} Lista de ciudades
 */
export async function obtenerCiudades() {
  const respuesta = await fetch(`${URL_API}/filtros/ciudades`);
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al obtener ciudades");
  }

  return datos;
}