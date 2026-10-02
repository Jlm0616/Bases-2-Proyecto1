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
