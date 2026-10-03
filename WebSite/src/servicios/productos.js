import URL_API from "./api";

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
    throw new Error(
      datos.error || datos.mensaje || "Error al buscar productos"
    );
  }

  return datos;
}

export async function obtenerGruposProductos() {
  const respuesta = await fetch(`${URL_API}/filtros/grupos-productos`);

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.error ||
        datos.mensaje ||
        "Error al obtener grupos de productos"
    );
  }

  return datos;
}

export async function obtenerDetalleProducto(id) {
  const respuesta = await fetch(`${URL_API}/productos/${id}`);

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.error ||
        datos.mensaje ||
        "Error al obtener el detalle del producto"
    );
  }

  return datos;
}

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
    throw new Error(
      datosRespuesta.error ||
        datosRespuesta.mensaje ||
        "Error al crear el producto"
    );
  }

  return datosRespuesta;
}

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
    throw new Error(
      datosRespuesta.error ||
        datosRespuesta.mensaje ||
        "Error al actualizar el producto"
    );
  }

  return datosRespuesta;
}

export async function eliminarProducto(id) {
  const respuesta = await fetch(`${URL_API}/productos/${id}`, {
    method: "DELETE",
  });

  const datosRespuesta = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datosRespuesta.error ||
        datosRespuesta.mensaje ||
        "Error al eliminar el producto"
    );
  }

  return datosRespuesta;
}

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
    throw new Error(
      datos.error || datos.mensaje || "Error al obtener proveedores"
    );
  }

  return datos;
}

export async function obtenerColores() {
  const respuesta = await fetch(`${URL_API}/filtros/colores`);
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.error || datos.mensaje || "Error al obtener colores"
    );
  }

  return datos;
}

export async function obtenerTiposEmpaque() {
  const respuesta = await fetch(`${URL_API}/filtros/tipos-empaque`);
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.error ||
        datos.mensaje ||
        "Error al obtener tipos de empaque"
    );
  }

  return datos;
}