import URL_API from "./api";

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
    throw new Error(
      datos.error || datos.mensaje || "Error al buscar proveedores"
    );
  }

  return datos;
}

export async function obtenerCategoriasProveedor() {
  const respuesta = await fetch(
    `${URL_API}/filtros/categorias-proveedores`
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.error ||
        datos.mensaje ||
        "Error al obtener categorías de proveedores"
    );
  }

  return datos;
}

export async function obtenerMetodosEntrega() {
  const respuesta = await fetch(
    `${URL_API}/filtros/metodos-entrega`
  );

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

export async function obtenerDetalleProveedor(id) {
  const respuesta = await fetch(`${URL_API}/proveedores/${id}`);

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.error ||
        datos.mensaje ||
        "Error al obtener el detalle del proveedor"
    );
  }

  return datos;
}

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
    throw new Error(
      datosRespuesta.error ||
        datosRespuesta.mensaje ||
        "Error al crear el proveedor"
    );
  }

  return datosRespuesta;
}

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
    throw new Error(
      datosRespuesta.error ||
        datosRespuesta.mensaje ||
        "Error al actualizar el proveedor"
    );
  }

  return datosRespuesta;
}

export async function eliminarProveedor(id) {
  const respuesta = await fetch(`${URL_API}/proveedores/${id}`, {
    method: "DELETE",
  });

  const datosRespuesta = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datosRespuesta.error ||
        datosRespuesta.mensaje ||
        "Error al eliminar el proveedor"
    );
  }

  return datosRespuesta;
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

export async function obtenerCiudades() {
  const respuesta = await fetch(`${URL_API}/filtros/ciudades`);
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.error || datos.mensaje || "Error al obtener ciudades"
    );
  }

  return datos;
}