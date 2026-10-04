import URL_API from "./api";

/**
 * Obtiene los años disponibles para reportes de ventas
 * @returns {Promise<Object>} Lista de años con registros de ventas
 */
export async function obtenerAniosVentas() {
  const respuesta = await fetch(
    `${URL_API}/filtros/anios-ventas`
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al obtener años de ventas");
  }

  return datos;
}

/**
 * Obtiene los años disponibles para reportes de compras
 * @returns {Promise<Object>} Lista de años con registros de compras
 */
export async function obtenerAniosCompras() {
  const respuesta = await fetch(
    `${URL_API}/filtros/anios-compras`
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al obtener años de compras");
  }

  return datos;
}

/**
 * Obtiene las categorías de productos disponibles
 * @returns {Promise<Object>} Lista de categorías de productos
 */
export async function obtenerCategoriasProducto() {
  const respuesta = await fetch(
    `${URL_API}/filtros/categorias-producto`
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al obtener categorías de producto");
  }

  return datos;
}

/**
 * Obtiene la lista de proveedores para filtros
 * @returns {Promise<Object>} Lista de proveedores
 */
export async function obtenerProveedores() {
  const respuesta = await fetch(
    `${URL_API}/filtros/proveedores`
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al obtener proveedores");
  }

  return datos;
}

/**
 * Obtiene la lista de productos para filtros
 * @returns {Promise<Object>} Lista de productos
 */
export async function obtenerProductos() {
  const respuesta = await fetch(
    `${URL_API}/filtros/productos`
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al obtener productos");
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
    throw new Error("Error al obtener categorías de cliente");
  }

  return datos;
}

/**
 * Obtiene las subcategorías de productos disponibles
 * @returns {Promise<Object>} Lista de subcategorías de productos
 */
export async function obtenerSubcategoriasProducto() {
  const respuesta = await fetch(
    `${URL_API}/filtros/subcategorias-producto`
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error("Error al obtener subcategorías de producto");
  }

  return datos;
}
