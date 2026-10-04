import URL_API from "./api";

async function procesarRespuesta(respuesta, mensajeError) {
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(mensajeError);
  }

  return datos;
}

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

export async function obtenerMatrizVentas() {
  const respuesta = await fetch(
    `${URL_API}/reportes/matriz-ventas-categorias`
  );

  return procesarRespuesta(
    respuesta,
    "Error al obtener matriz de ventas"
  );
}

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
