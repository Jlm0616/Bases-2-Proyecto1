import URL_API from "./api";

/**
 * Busca clientes según los filtros proporcionados
 * @param {Object} filtros - Objeto con los filtros de búsqueda
 * @returns {Promise<Object>} Lista de clientes que coinciden con los filtros
 */
export async function buscarClientes(filtros) {
  const respuesta = await fetch(`${URL_API}/clientes/buscar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filtros),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al buscar clientes");
  }

  return datos;
}

/**
 * Obtiene las categorías de clientes disponibles
 * @returns {Promise<Object>} Lista de categorías de clientes
 */
export async function obtenerCategoriasCliente() {
  const respuesta = await fetch(
    `${URL_API}/filtros/categorias-clientes`
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al obtener categorías de clientes");
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
 * Obtiene el detalle de un cliente específico
 * @param {number} id - ID del cliente a consultar
 * @returns {Promise<Object>} Información detallada del cliente
 */
export async function obtenerDetalleCliente(id) {
  const respuesta = await fetch(`${URL_API}/clientes/${id}`);

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al obtener el detalle del cliente");
  }

  return datos;
}

/**
 * Crea un nuevo cliente
 * @param {Object} datos - Datos del cliente a crear
 * @returns {Promise<Object>} Cliente creado con su ID
 */
export async function crearCliente(datos) {
  const respuesta = await fetch(`${URL_API}/clientes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  const datosRespuesta = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al crear el cliente");
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

/**
 * Obtiene los grupos de compra disponibles
 * @returns {Promise<Object>} Lista de grupos de compra
 */
export async function obtenerGruposCompra() {
  const respuesta = await fetch(`${URL_API}/filtros/grupos-compra`);
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al obtener grupos de compra");
  }

  return datos;
}

/**
 * Actualiza los datos de un cliente existente
 * @param {number} id - ID del cliente a actualizar
 * @param {Object} datos - Nuevos datos del cliente
 * @returns {Promise<Object>} Cliente actualizado
 */
export async function actualizarCliente(id, datos) {
  const respuesta = await fetch(`${URL_API}/clientes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  const datosRespuesta = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al actualizar el cliente");
  }

  return datosRespuesta;
}

/**
 * Elimina un cliente existente
 * @param {number} id - ID del cliente a eliminar
 * @returns {Promise<Object>} Confirmación de eliminación
 */
export async function eliminarCliente(id) {
  const respuesta = await fetch(`${URL_API}/clientes/${id}`, {
    method: "DELETE",
  });

  const datosRespuesta = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al eliminar el cliente");
  }

  return datosRespuesta;
}