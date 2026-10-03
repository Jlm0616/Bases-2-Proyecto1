import URL_API from "./api";

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
    throw new Error(
      datos.error || datos.mensaje || "Error al buscar clientes"
    );
  }

  return datos;
}

export async function obtenerCategoriasCliente() {
  const respuesta = await fetch(
    `${URL_API}/filtros/categorias-clientes`
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.error ||
        datos.mensaje ||
        "Error al obtener categorías de clientes"
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

export async function obtenerDetalleCliente(id) {
  const respuesta = await fetch(`${URL_API}/clientes/${id}`);

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.error ||
        datos.mensaje ||
        "Error al obtener el detalle del cliente"
    );
  }

  return datos;
}

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
    throw new Error(
      datosRespuesta.error ||
        datosRespuesta.mensaje ||
        "Error al crear el cliente"
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

export async function obtenerGruposCompra() {
  const respuesta = await fetch(`${URL_API}/filtros/grupos-compra`);
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.error || datos.mensaje || "Error al obtener grupos de compra"
    );
  }

  return datos;
}

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
    throw new Error(
      datosRespuesta.error ||
        datosRespuesta.mensaje ||
        "Error al actualizar el cliente"
    );
  }

  return datosRespuesta;
}

export async function eliminarCliente(id) {
  const respuesta = await fetch(`${URL_API}/clientes/${id}`, {
    method: "DELETE",
  });

  const datosRespuesta = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datosRespuesta.error ||
        datosRespuesta.mensaje ||
        "Error al eliminar el cliente"
    );
  }

  return datosRespuesta;
}