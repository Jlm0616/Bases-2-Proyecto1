import URL_API from "./api";

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
    throw new Error(
      datos.error || datos.mensaje || "Error al buscar ventas"
    );
  }

  return datos;
}

export async function obtenerDetalleVenta(id) {
  const respuesta = await fetch(`${URL_API}/ventas/${id}`);

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.error ||
        datos.mensaje ||
        "Error al obtener el detalle de la venta"
    );
  }

  return datos;
}

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
    throw new Error(
      datosRespuesta.error ||
        datosRespuesta.mensaje ||
        "Error al crear la venta"
    );
  }

  return datosRespuesta;
}

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
    throw new Error(
      datosRespuesta.error ||
        datosRespuesta.mensaje ||
        "Error al actualizar la venta"
    );
  }

  return datosRespuesta;
}

export async function eliminarVenta(id) {
  const respuesta = await fetch(`${URL_API}/ventas/${id}`, {
    method: "DELETE",
  });

  const datosRespuesta = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datosRespuesta.error ||
        datosRespuesta.mensaje ||
        "Error al eliminar la venta"
    );
  }

  return datosRespuesta;
}

// Catálogos para el formulario de nueva venta

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
    throw new Error(
      datos.error || datos.mensaje || "Error al obtener clientes"
    );
  }

  return datos;
}

export async function obtenerPersonas() {
  const respuesta = await fetch(`${URL_API}/filtros/personas`);
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.error || datos.mensaje || "Error al obtener personas"
    );
  }

  return datos;
}

export async function obtenerMetodosEntrega() {
  const respuesta = await fetch(`${URL_API}/filtros/metodos-entrega`);
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.error ||
        datos.mensaje ||
        "Error al obtener métodos de entrega"
    );
  }

  return datos;
}

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