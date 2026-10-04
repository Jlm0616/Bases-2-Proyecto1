import URL_API from "./api";

/**
 * Procesa la respuesta de la API y maneja errores
 * @param {Response} respuesta - Objeto de respuesta de fetch
 * @param {string} mensajeError - Mensaje de error personalizado
 * @returns {Promise<Object>} Datos de la respuesta en formato JSON
 */
async function procesarRespuesta(respuesta, mensajeError) {
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(mensajeError);
  }

  return datos;
}

/**
 * Obtiene los montos totales por proveedor
 * @param {Object} filtros - Filtros para el reporte (fechas, categorías, etc.)
 * @returns {Promise<Object>} Montos acumulados por proveedor
 */
export async function obtenerMontosProveedores(filtros) {
  const respuesta = await fetch(
    `${URL_API}/reportes/montos-proveedores`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filtros),
    }
  );

  return procesarRespuesta(
    respuesta,
    "Error al obtener montos de proveedores"
  );
}

/**
 * Obtiene los montos totales por cliente
 * @param {Object} filtros - Filtros para el reporte (fechas, categorías, etc.)
 * @returns {Promise<Object>} Montos acumulados por cliente
 */
export async function obtenerMontosClientes(filtros) {
  const respuesta = await fetch(
    `${URL_API}/reportes/montos-clientes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filtros),
    }
  );

  return procesarRespuesta(
    respuesta,
    "Error al obtener montos de clientes"
  );
}

/**
 * Obtiene los productos más vendidos
 * @param {Object} filtros - Filtros para el reporte (fechas, categorías, etc.)
 * @returns {Promise<Object>} Lista de productos ordenados por ventas
 */
export async function obtenerTopProductos(filtros) {
  const respuesta = await fetch(
    `${URL_API}/reportes/top-productos`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filtros),
    }
  );

  return procesarRespuesta(
    respuesta,
    "Error al obtener top de productos"
  );
}

/**
 * Obtiene los clientes con mayor volumen de compras
 * @param {Object} filtros - Filtros para el reporte (fechas, categorías, etc.)
 * @returns {Promise<Object>} Lista de clientes ordenados por volumen de compras
 */
export async function obtenerTopClientes(filtros) {
  const respuesta = await fetch(
    `${URL_API}/reportes/top-clientes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filtros),
    }
  );

  return procesarRespuesta(
    respuesta,
    "Error al obtener top de clientes"
  );
}

/**
 * Obtiene los proveedores con mayor volumen de ventas
 * @param {Object} filtros - Filtros para el reporte (fechas, categorías, etc.)
 * @returns {Promise<Object>} Lista de proveedores ordenados por volumen de ventas
 */
export async function obtenerTopProveedores(filtros) {
  const respuesta = await fetch(
    `${URL_API}/reportes/top-proveedores`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filtros),
    }
  );

  return procesarRespuesta(
    respuesta,
    "Error al obtener top de proveedores"
  );
}

/**
 * Obtiene la matriz de ventas por categorías
 * @returns {Promise<Object>} Matriz de ventas organizada por categorías
 */
export async function obtenerMatrizVentas() {
  const respuesta = await fetch(
    `${URL_API}/reportes/matriz-ventas-categorias`
  );

  return procesarRespuesta(
    respuesta,
    "Error al obtener matriz de ventas"
  );
}

/**
 * Obtiene el seguimiento de clientes en el tiempo
 * @param {Object} filtros - Filtros para el reporte (fechas, categorías, etc.)
 * @returns {Promise<Object>} Datos de seguimiento de clientes por período
 */
export async function obtenerSeguimientoClientes(filtros) {
  const respuesta = await fetch(
    `${URL_API}/reportes/seguimiento-clientes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filtros),
    }
  );

  return procesarRespuesta(
    respuesta,
    "Error al obtener seguimiento de clientes"
  );
}

/**
 * Obtiene el seguimiento de proveedores en el tiempo
 * @param {Object} filtros - Filtros para el reporte (fechas, categorías, etc.)
 * @returns {Promise<Object>} Datos de seguimiento de proveedores por período
 */
export async function obtenerSeguimientoProveedores(filtros) {
  const respuesta = await fetch(
    `${URL_API}/reportes/seguimiento-proveedores`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filtros),
    }
  );

  return procesarRespuesta(
    respuesta,
    "Error al obtener seguimiento de proveedores"
  );
}

/**
 * Obtiene la rotación de inventario de productos
 * @param {Object} filtros - Filtros para el reporte (fechas, categorías, etc.)
 * @returns {Promise<Object>} Datos de rotación de inventario por producto
 */
export async function obtenerRotacionInventario(filtros) {
  const respuesta = await fetch(
    `${URL_API}/reportes/rotacion-inventario`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filtros),
    }
  );

  return procesarRespuesta(
    respuesta,
    "Error al obtener rotación de inventario"
  );
}

/**
 * Obtiene el método de envío favorito según los filtros
 * @param {Object} filtros - Filtros para el reporte (fechas, categorías, etc.)
 * @returns {Promise<Object>} Datos de métodos de envío más utilizados
 */
export async function obtenerMetodoEnvioFavorito(filtros) {
  const respuesta = await fetch(
    `${URL_API}/reportes/metodo-envio-favorito`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filtros),
    }
  );

  return procesarRespuesta(
    respuesta,
    "Error al obtener método de envío favorito"
  );
}
