import { useEffect, useState } from "react";

import { buscarVentas } from "../servicios/ventas";
import { buscarClientes } from "../servicios/clientes";
import { buscarProveedores } from "../servicios/proveedores";
import { buscarProductos } from "../servicios/productos";

import "../estilos/inicio.css";

/**
 * Página principal con resumen general del sistema
 * @returns {JSX.Element} La página renderizada
 */
function Inicio() {
  const [resumen, setResumen] = useState({
    clientes: 0,
    proveedores: 0,
    productos: 0,
    ventas: 0,
  });

  const [ventasRecientes, setVentasRecientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarInicio();
  }, []);

  async function cargarInicio() {
    try {
      setCargando(true);
      setError("");

      const [
        respuestaClientes,
        respuestaProveedores,
        respuestaProductos,
        respuestaVentas,
      ] = await Promise.all([
        buscarClientes({ nombre: "", idCategoria: null, idMetodoEntrega: null }),

        buscarProveedores({ nombre: "", idCategoria: null }),

        buscarProductos({ nombre: "", idGrupo: null }),

        buscarVentas({
          nombreCliente: null,
          fechaInicio: null,
          fechaFin: null,
          montoMinimo: null,
          montoMaximo: null,
          page: 1,
          pageSize: 3,
        }),
      ]);

      setResumen({
        clientes: Array.isArray(respuestaClientes) ? respuestaClientes.length : 0,
        proveedores: Array.isArray(respuestaProveedores) ? respuestaProveedores.length : 0,
        productos: Array.isArray(respuestaProductos) ? respuestaProductos.length : 0,
        ventas: respuestaVentas.total || 0,
      });

      setVentasRecientes(respuestaVentas.datos || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }

  function formatearFecha(fecha) {
    if (!fecha) return "—";

    return new Date(fecha).toLocaleDateString("es-CR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  function formatearMoneda(valor) {
    if (valor === null || valor === undefined) return "—";

    return `$${Number(valor).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return (
    <main className="contenido-inicio">
      <section className="encabezado-inicio">
        <div>
          <span className="etiqueta-inicio">Panel principal</span>

          <h1>Resumen general</h1>

          <p>
            Información actualizada del sistema WideWorldImporters.
          </p>
        </div>

        <div className="estado-sistema">
          <span className="punto-estado"></span>
          Sistema disponible
        </div>
      </section>

      {error && (
        <div className="mensaje-error-inicio">
          {error}
        </div>
      )}

      <section className="tarjetas-inicio">
        <article className="tarjeta-inicio tarjeta-clientes">
          <div className="tarjeta-superior">
            <div className="icono-tarjeta">C</div>
            <span className="indicador-tarjeta">Clientes</span>
          </div>

          <div className="valor-tarjeta">
            {cargando ? "..." : resumen.clientes.toLocaleString()}
          </div>

          <p>Clientes registrados</p>

          <div className="barra-tarjeta"></div>
        </article>

        <article className="tarjeta-inicio tarjeta-proveedores">
          <div className="tarjeta-superior">
            <div className="icono-tarjeta">P</div>
            <span className="indicador-tarjeta">Proveedores</span>
          </div>

          <div className="valor-tarjeta">
            {cargando ? "..." : resumen.proveedores.toLocaleString()}
          </div>

          <p>Proveedores registrados</p>

          <div className="barra-tarjeta"></div>
        </article>

        <article className="tarjeta-inicio tarjeta-productos">
          <div className="tarjeta-superior">
            <div className="icono-tarjeta">I</div>
            <span className="indicador-tarjeta">Inventario</span>
          </div>

          <div className="valor-tarjeta">
            {cargando ? "..." : resumen.productos.toLocaleString()}
          </div>

          <p>Productos registrados</p>

          <div className="barra-tarjeta"></div>
        </article>

        <article className="tarjeta-inicio tarjeta-ventas">
          <div className="tarjeta-superior">
            <div className="icono-tarjeta">V</div>
            <span className="indicador-tarjeta">Ventas</span>
          </div>

          <div className="valor-tarjeta">
            {cargando ? "..." : resumen.ventas.toLocaleString()}
          </div>

          <p>Facturas registradas</p>

          <div className="barra-tarjeta"></div>
        </article>
      </section>

      <section className="grid-inicio">
        <div className="panel-inicio panel-ventas-recientes">
          <div className="encabezado-panel-inicio">
            <div>
              <span className="subtitulo-panel">
                Actividad reciente
              </span>

              <h2>Ventas recientes</h2>

              <p>
                Últimas facturas registradas en el sistema.
              </p>
            </div>

            <span className="contador-registros">
              {ventasRecientes.length} registros
            </span>
          </div>

          <div className="contenedor-tabla-inicio">
            <table className="tabla-inicio">
              <thead>
                <tr>
                  <th>Factura</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th className="columna-monto">Monto</th>
                </tr>
              </thead>

              <tbody>
                {!cargando && ventasRecientes.length > 0 ? (
                  ventasRecientes.map((venta) => (
                    <tr key={venta.NumeroFactura}>
                      <td>
                        <span className="numero-factura">
                          #{venta.NumeroFactura}
                        </span>
                      </td>

                      <td>
                        <div className="cliente-tabla">
                          <div className="avatar-cliente">
                            {venta.NombreCliente?.charAt(0) || "C"}
                          </div>

                          <span>{venta.NombreCliente}</span>
                        </div>
                      </td>

                      <td>
                        {formatearFecha(venta.FechaFactura)}
                      </td>

                      <td className="monto-venta">
                        {formatearMoneda(venta.MontoFactura)}
                      </td>
                    </tr>
                  ))
                ) : (
                  !cargando && (
                    <tr>
                      <td colSpan="4">
                        No hay ventas registradas.
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="panel-inicio panel-informacion">
          <div className="icono-informacion">
            WW
          </div>

          <span className="subtitulo-panel">
            WideWorldImporters
          </span>

          <h2>Panel administrativo</h2>

          <p>
            Administración general de clientes, proveedores,
            productos, ventas y reportes del sistema.
          </p>

          <div className="lista-modulos">
            <div>
              <span className="punto-modulo clientes"></span>
              Clientes
            </div>

            <div>
              <span className="punto-modulo proveedores"></span>
              Proveedores
            </div>

            <div>
              <span className="punto-modulo productos"></span>
              Productos
            </div>

            <div>
              <span className="punto-modulo ventas"></span>
              Ventas
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default Inicio;
