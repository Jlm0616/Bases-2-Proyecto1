import URL_API from "./api";

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
