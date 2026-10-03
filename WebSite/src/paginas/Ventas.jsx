import { useEffect, useState } from "react";
import {
  buscarVentas,
  obtenerDetalleVenta,
  crearVenta,
  actualizarVenta,
  eliminarVenta,
  obtenerClientes,
  obtenerPersonas,
  obtenerMetodosEntrega,
  obtenerProductos,
} from "../servicios/ventas";
import Modal from "../componentes/Modal";
import "../estilos/ventas.css";

const FORMULARIO_VACIO = {
  idCliente: "",
  idPersonaContacto: "1361",
  idVendedor: "1361",
  idEditadoPor: "1361",
  idMetodoEntrega: "1",
  idPersonaCuentas: "",
  idPersonaEmpacadora: "",
  numeroOrdenCompra: "",
  instruccionesEntrega: "",
  lineas: [{ idProducto: "", cantidad: "1", precioUnitario: "0" }],
};

function Ventas() {
  // Filtros
  const [nombreCliente, setNombreCliente] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [montoMinimo, setMontoMinimo] = useState("");
  const [montoMaximo, setMontoMaximo] = useState("");

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalVentas, setTotalVentas] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);

  // Catálogos
  const [clientes, setClientes] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [metodosEntrega, setMetodosEntrega] = useState([]);
  const [productos, setProductos] = useState([]);

  // Tabla
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  // Modales
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [detalleVenta, setDetalleVenta] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  const [modalFormularioAbierto, setModalFormularioAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState("");

  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [ventaEliminando, setVentaEliminando] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  // Cargar ventas (paginado)
  async function cargarVentas(pagina = paginaActual, tamano = pageSize) {
    try {
      setCargando(true);
      setError("");

      const filtros = {
        nombreCliente: nombreCliente || null,
        fechaInicio: fechaInicio || null,
        fechaFin: fechaFin || null,
        montoMinimo: montoMinimo ? Number(montoMinimo) : null,
        montoMaximo: montoMaximo ? Number(montoMaximo) : null,
        page: pagina,
        pageSize: tamano,
      };

      const respuesta = await buscarVentas(filtros);

      // El backend ahora devuelve { datos, total, page, pageSize, totalPages }
      setVentas(respuesta.datos || []);
      setTotalVentas(respuesta.total || 0);
      setTotalPaginas(respuesta.totalPages || 0);
      setPaginaActual(respuesta.page || 1);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }

  async function cargarCatalogos() {
    try {
      const [
        clientesObtenidos,
        personasObtenidas,
        metodosObtenidos,
        productosObtenidos,
      ] = await Promise.all([
        obtenerClientes(),
        obtenerPersonas(),
        obtenerMetodosEntrega(),
        obtenerProductos(),
      ]);

      setClientes(clientesObtenidos);
      setPersonas(personasObtenidas);
      setMetodosEntrega(metodosObtenidos);
      setProductos(productosObtenidos);
    } catch (error) {
      setError(error.message);
    }
  }

  // Carga inicial
  useEffect(() => {
    cargarVentas(1, pageSize);
    cargarCatalogos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce: recargar desde página 1 cuando cambian filtros
  useEffect(() => {
    const timer = setTimeout(() => {
      setPaginaActual(1);
      cargarVentas(1, pageSize);
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nombreCliente, fechaInicio, fechaFin, montoMinimo, montoMaximo]);

  // Cambiar de página
  function irPagina(nuevaPagina) {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return;
    setPaginaActual(nuevaPagina);
    cargarVentas(nuevaPagina, pageSize);
  }

  // Cambiar tamaño de página
  function cambiarPageSize(nuevoTamano) {
    setPageSize(nuevoTamano);
    setPaginaActual(1);
    cargarVentas(1, nuevoTamano);
  }

  async function limpiarFiltros() {
    setNombreCliente("");
    setFechaInicio("");
    setFechaFin("");
    setMontoMinimo("");
    setMontoMaximo("");
    setPaginaActual(1);
    // El useEffect se encargará de recargar
  }

  // Helpers
  function resolverIdCliente(texto) {
    if (!texto) return "";
    const encontrado = clientes.find((c) => c.NombreCliente === texto);
    return encontrado ? encontrado.IdCliente.toString() : "";
  }

  function formatearFecha(fecha) {
    if (!fecha) return "—";
    const d = new Date(fecha);
    return d.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  function formatearMoneda(valor) {
    if (valor === null || valor === undefined) return "—";
    return `$${Number(valor).toFixed(2)}`;
  }

  // -------------------- VER DETALLE --------------------
  async function verVenta(idVenta) {
    setModalDetalleAbierto(true);
    setCargandoDetalle(true);
    setDetalleVenta(null);

    try {
      const detalle = await obtenerDetalleVenta(idVenta);
      setDetalleVenta(detalle);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargandoDetalle(false);
    }
  }

  function cerrarModalDetalle() {
    setModalDetalleAbierto(false);
    setDetalleVenta(null);
  }

  // -------------------- CREAR / EDITAR --------------------
  function abrirModalCrear() {
    setFormulario(FORMULARIO_VACIO);
    setBusquedaCliente("");
    setModoEdicion(false);
    setIdEditando(null);
    setErrorFormulario("");
    setModalFormularioAbierto(true);
  }

  async function abrirModalEditar(venta) {
    try {
      const detalle = await obtenerDetalleVenta(venta.NumeroFactura);

      setFormulario({
        ...FORMULARIO_VACIO,
        numeroOrdenCompra: detalle.encabezado?.NumeroOrdenCompra || "",
        instruccionesEntrega:
          detalle.encabezado?.InstruccionesEntrega || "",
      });

      setModoEdicion(true);
      setIdEditando(venta.NumeroFactura);
      setErrorFormulario("");
      setModalFormularioAbierto(true);
    } catch (error) {
      setError(error.message);
    }
  }

  function cerrarModalFormulario() {
    setModalFormularioAbierto(false);
    setFormulario(FORMULARIO_VACIO);
    setBusquedaCliente("");
    setModoEdicion(false);
    setIdEditando(null);
    setErrorFormulario("");
  }

  function actualizarCampo(nombreCampo, valor) {
    setFormulario((prev) => ({ ...prev, [nombreCampo]: valor }));
  }

  function agregarLinea() {
    setFormulario((prev) => ({
      ...prev,
      lineas: [
        ...prev.lineas,
        { idProducto: "", cantidad: "1", precioUnitario: "0" },
      ],
    }));
  }

  function eliminarLinea(indice) {
    setFormulario((prev) => ({
      ...prev,
      lineas: prev.lineas.filter((_, i) => i !== indice),
    }));
  }

  function actualizarLinea(indice, campo, valor) {
    setFormulario((prev) => {
      const nuevasLineas = [...prev.lineas];
      nuevasLineas[indice] = { ...nuevasLineas[indice], [campo]: valor };
      return { ...prev, lineas: nuevasLineas };
    });
  }

  async function guardarVenta(evento) {
    evento.preventDefault();
    setErrorFormulario("");

    if (!modoEdicion) {
      if (!formulario.idCliente) {
        setErrorFormulario("Debe seleccionar un cliente válido.");
        return;
      }
      if (!formulario.idVendedor) {
        setErrorFormulario("Debe seleccionar un vendedor válido.");
        return;
      }
      if (!formulario.lineas || formulario.lineas.length === 0) {
        setErrorFormulario("La venta debe tener al menos una línea.");
        return;
      }

      for (let i = 0; i < formulario.lineas.length; i++) {
        const l = formulario.lineas[i];
        if (!l.idProducto) {
          setErrorFormulario(`La línea ${i + 1} debe tener un producto.`);
          return;
        }
        if (!l.cantidad || Number(l.cantidad) < 1) {
          setErrorFormulario(
            `La cantidad de la línea ${i + 1} debe ser al menos 1.`
          );
          return;
        }
        if (!l.precioUnitario || Number(l.precioUnitario) < 0) {
          setErrorFormulario(
            `El precio de la línea ${i + 1} no puede ser negativo.`
          );
          return;
        }
      }
    }

    try {
      setGuardando(true);

      if (modoEdicion) {
        await actualizarVenta(idEditando, {
          instruccionesEntrega:
            formulario.instruccionesEntrega.trim() || null,
          numeroOrdenCompra: formulario.numeroOrdenCompra.trim() || null,
          idEditadoPor: Number(formulario.idEditadoPor),
        });
      } else {
        const payload = {
          idCliente: Number(formulario.idCliente),
          idPersonaContacto: Number(formulario.idPersonaContacto),
          idVendedor: Number(formulario.idVendedor),
          idEditadoPor: Number(formulario.idEditadoPor),
          idMetodoEntrega: Number(formulario.idMetodoEntrega) || 1,
          idPersonaCuentas: formulario.idPersonaCuentas
            ? Number(formulario.idPersonaCuentas)
            : null,
          idPersonaEmpacadora: formulario.idPersonaEmpacadora
            ? Number(formulario.idPersonaEmpacadora)
            : null,
          numeroOrdenCompra: formulario.numeroOrdenCompra.trim() || null,
          instruccionesEntrega:
            formulario.instruccionesEntrega.trim() || null,
          lineas: formulario.lineas.map((l) => ({
            idProducto: Number(l.idProducto),
            cantidad: Number(l.cantidad),
            precioUnitario: Number(l.precioUnitario),
            idTipoEmpaque: null,
          })),
        };

        await crearVenta(payload);
      }

      cerrarModalFormulario();
      await cargarVentas();
    } catch (error) {
      setErrorFormulario(error.message);
    } finally {
      setGuardando(false);
    }
  }

  // -------------------- ELIMINAR --------------------
  function abrirModalEliminar(venta) {
    setVentaEliminando(venta);
    setModalEliminarAbierto(true);
  }

  function cerrarModalEliminar() {
    setModalEliminarAbierto(false);
    setVentaEliminando(null);
  }

  async function confirmarEliminar() {
    if (!ventaEliminando) return;

    try {
      setEliminando(true);
      await eliminarVenta(ventaEliminando.NumeroFactura);
      cerrarModalEliminar();
      await cargarVentas();
    } catch (error) {
      setError(error.message);
      cerrarModalEliminar();
    } finally {
      setEliminando(false);
    }
  }

  // -------------------- PAGINACIÓN --------------------
  function generarPaginas() {
    const paginas = [];
    const maxBotones = 5;
    let inicio = Math.max(1, paginaActual - 2);
    let fin = Math.min(totalPaginas, inicio + maxBotones - 1);

    if (fin - inicio + 1 < maxBotones) {
      inicio = Math.max(1, fin - maxBotones + 1);
    }

    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }
    return paginas;
  }

  return (
    <main className="contenido-ventas">
      <section className="encabezado-ventas">
        <div>
          <h2>Ventas</h2>
          <p>Administración de ventas del sistema.</p>
        </div>

        <button
          className="boton-principal-vta"
          onClick={abrirModalCrear}
        >
          Agregar venta
        </button>
      </section>

      {/* FILTROS */}
      <section className="seccion-filtros-vta">
        <div className="grupo-filtro-vta">
          <label>Cliente</label>
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={nombreCliente}
            onChange={(e) => setNombreCliente(e.target.value)}
          />
        </div>

        <div className="grupo-filtro-vta">
          <label>Fecha inicio</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>

        <div className="grupo-filtro-vta">
          <label>Fecha fin</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>

        <div className="grupo-filtro-vta">
          <label>Monto mín.</label>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="0"
            value={montoMinimo}
            onChange={(e) => setMontoMinimo(e.target.value)}
          />
        </div>

        <div className="grupo-filtro-vta">
          <label>Monto máx.</label>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="999999"
            value={montoMaximo}
            onChange={(e) => setMontoMaximo(e.target.value)}
          />
        </div>

        <div className="grupo-botones-vta">
          <button
            className="boton-secundario-vta"
            onClick={() => cargarVentas(1, pageSize)}
          >
            Buscar
          </button>
          <button
            className="boton-secundario-vta"
            onClick={limpiarFiltros}
          >
            Limpiar filtros
          </button>
        </div>
      </section>

      {/* TABLA */}
      <section className="seccion-tabla-vta">
        <div className="titulo-tabla-vta">
          <div>
            <h3>Listado de ventas</h3>
            <p>Facturas registradas en el sistema.</p>
          </div>

          <span className="cantidad-vta">
            {totalVentas} ventas
          </span>
        </div>

        {error && <div className="mensaje-error-vta">{error}</div>}

        {cargando ? (
          <div className="mensaje-cargando-vta">Cargando ventas...</div>
        ) : (
          <>
            <div className="contenedor-tabla-vta">
              <table className="tabla-vta">
                <thead>
                  <tr>
                    <th># Factura</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Método de entrega</th>
                    <th>Monto</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {ventas.length > 0 ? (
                    ventas.map((venta) => (
                      <tr key={venta.NumeroFactura}>
                        <td>{venta.NumeroFactura}</td>
                        <td>{formatearFecha(venta.FechaFactura)}</td>
                        <td>{venta.NombreCliente}</td>
                        <td>{venta.MetodoEntrega || "—"}</td>
                        <td>{formatearMoneda(venta.MontoFactura)}</td>
                        <td>
                          <div className="acciones-vta">
                            <button
                              className="boton-ver-vta"
                              onClick={() =>
                                verVenta(venta.NumeroFactura)
                              }
                            >
                              Ver
                            </button>

                            <button
                              className="boton-editar-vta"
                              onClick={() => abrirModalEditar(venta)}
                            >
                              Editar
                            </button>

                            <button
                              className="boton-eliminar-vta"
                              onClick={() => abrirModalEliminar(venta)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="sin-resultados-vta">
                        No se encontraron ventas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINACIÓN */}
            {totalPaginas > 1 && (
              <div className="paginacion-vta">
                <div className="paginacion-info-vta">
                  Mostrando {(paginaActual - 1) * pageSize + 1} a{" "}
                  {Math.min(paginaActual * pageSize, totalVentas)} de{" "}
                  {totalVentas}
                </div>

                <div className="paginacion-controles-vta">
                  <button
                    className="boton-pagina-vta"
                    onClick={() => irPagina(1)}
                    disabled={paginaActual === 1}
                  >
                    «
                  </button>

                  <button
                    className="boton-pagina-vta"
                    onClick={() => irPagina(paginaActual - 1)}
                    disabled={paginaActual === 1}
                  >
                    ‹ Anterior
                  </button>

                  {generarPaginas().map((num) => (
                    <button
                      key={num}
                      className={`boton-pagina-vta ${
                        num === paginaActual ? "pagina-activa-vta" : ""
                      }`}
                      onClick={() => irPagina(num)}
                    >
                      {num}
                    </button>
                  ))}

                  <button
                    className="boton-pagina-vta"
                    onClick={() => irPagina(paginaActual + 1)}
                    disabled={paginaActual === totalPaginas}
                  >
                    Siguiente ›
                  </button>

                  <button
                    className="boton-pagina-vta"
                    onClick={() => irPagina(totalPaginas)}
                    disabled={paginaActual === totalPaginas}
                  >
                    »
                  </button>
                </div>

                <div className="paginacion-tamano-vta">
                  <label>Por página:</label>
                  <select
                    value={pageSize}
                    onChange={(e) =>
                      cambiarPageSize(Number(e.target.value))
                    }
                  >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={250}>250</option>
                  </select>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* MODAL DETALLE */}
      <Modal
        isOpen={modalDetalleAbierto}
        onClose={cerrarModalDetalle}
      >
        {cargandoDetalle ? (
          <p>Cargando detalle...</p>
        ) : detalleVenta && detalleVenta.encabezado ? (
          <div className="detalle-vta">
            <h3>
              Factura #{detalleVenta.encabezado.NumeroFactura}
            </h3>
            <p className="subtitulo-vta">
              {formatearFecha(detalleVenta.encabezado.FechaFactura)}
            </p>

            <div className="seccion-encabezado-vta">
              <div className="grid-encabezado-vta">
                <div className="campo-vta">
                  <span className="campo-etiqueta-vta">Cliente</span>
                  <span className="campo-valor-vta">
                    {detalleVenta.encabezado.NombreCliente || "—"}
                  </span>
                </div>

                <div className="campo-vta">
                  <span className="campo-etiqueta-vta">
                    Método de entrega
                  </span>
                  <span className="campo-valor-vta">
                    {detalleVenta.encabezado.MetodoEntrega || "—"}
                  </span>
                </div>

                <div className="campo-vta">
                  <span className="campo-etiqueta-vta">
                    Número de orden
                  </span>
                  <span className="campo-valor-vta">
                    {detalleVenta.encabezado.NumeroOrdenCompra || "—"}
                  </span>
                </div>

                <div className="campo-vta">
                  <span className="campo-etiqueta-vta">
                    Persona de contacto
                  </span>
                  <span className="campo-valor-vta">
                    {detalleVenta.encabezado.PersonaContacto || "—"}
                  </span>
                </div>

                <div className="campo-vta">
                  <span className="campo-etiqueta-vta">
                    Nombre del vendedor
                  </span>
                  <span className="campo-valor-vta">
                    {detalleVenta.encabezado.NombreVendedor || "—"}
                  </span>
                </div>

                <div className="campo-vta">
                  <span className="campo-etiqueta-vta">
                    Fecha de factura
                  </span>
                  <span className="campo-valor-vta">
                    {formatearFecha(
                      detalleVenta.encabezado.FechaFactura
                    )}
                  </span>
                </div>

                <div className="campo-vta" style={{ gridColumn: "1 / -1" }}>
                  <span className="campo-etiqueta-vta">
                    Instrucciones de entrega
                  </span>
                  <span className="campo-valor-vta">
                    {detalleVenta.encabezado.InstruccionesEntrega || "—"}
                  </span>
                </div>
              </div>
            </div>

            <div className="titulo-lineas-vta">
              Detalle de la factura
            </div>

            <table className="tabla-lineas-vta">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio unit.</th>
                  <th>Impuesto</th>
                  <th>Monto impuesto</th>
                  <th>Total línea</th>
                </tr>
              </thead>
              <tbody>
                {detalleVenta.detalle && detalleVenta.detalle.length > 0 ? (
                  detalleVenta.detalle.map((linea, idx) => (
                    <tr key={idx}>
                      <td>{linea.NombreProducto}</td>
                      <td>{linea.Cantidad}</td>
                      <td>{formatearMoneda(linea.PrecioUnitario)}</td>
                      <td>{linea.ImpuestoAplicado}%</td>
                      <td>{formatearMoneda(linea.MontoImpuesto)}</td>
                      <td>{formatearMoneda(linea.TotalPorLinea)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      Sin líneas registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : null}
      </Modal>

      {/* MODAL CREAR / EDITAR */}
      <Modal
        isOpen={modalFormularioAbierto}
        onClose={cerrarModalFormulario}
      >
        <form
          className="formulario-vta"
          onSubmit={guardarVenta}
        >
          <h3>{modoEdicion ? "Editar venta" : "Nueva venta"}</h3>

          {errorFormulario && (
            <div className="mensaje-error-vta">{errorFormulario}</div>
          )}

          {modoEdicion ? (
            <div className="formulario-grid-vta">
              <div className="campo-formulario-vta ancho-completo-vta">
                <label>Número de orden de compra</label>
                <input
                  type="text"
                  value={formulario.numeroOrdenCompra}
                  onChange={(e) =>
                    actualizarCampo("numeroOrdenCompra", e.target.value)
                  }
                />
              </div>

              <div className="campo-formulario-vta ancho-completo-vta">
                <label>Instrucciones de entrega</label>
                <textarea
                  value={formulario.instruccionesEntrega}
                  onChange={(e) =>
                    actualizarCampo("instruccionesEntrega", e.target.value)
                  }
                />
              </div>
            </div>
          ) : (
            <>
              <div className="formulario-grid-vta">
                <div className="campo-formulario-vta">
                  <label>Cliente *</label>
                  <input
                    type="text"
                    list="lista-clientes-vta"
                    value={busquedaCliente}
                    onChange={(e) => {
                      const texto = e.target.value;
                      setBusquedaCliente(texto);
                      const id = resolverIdCliente(texto);
                      actualizarCampo("idCliente", id);
                    }}
                    placeholder="Escriba para buscar..."
                    required
                  />
                  <datalist id="lista-clientes-vta">
                    {clientes.slice(0, 500).map((c) => (
                      <option
                        key={c.IdCliente}
                        value={c.NombreCliente}
                      />
                    ))}
                  </datalist>
                </div>

                <div className="campo-formulario-vta">
                  <label>Método de entrega</label>
                  <select
                    value={formulario.idMetodoEntrega}
                    onChange={(e) =>
                      actualizarCampo("idMetodoEntrega", e.target.value)
                    }
                  >
                    {metodosEntrega.map((m) => (
                      <option
                        key={m.IdMetodoEntrega}
                        value={m.IdMetodoEntrega}
                      >
                        {m.NombreMetodoEntrega}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="campo-formulario-vta">
                  <label>Persona de contacto</label>
                  <select
                    value={formulario.idPersonaContacto}
                    onChange={(e) =>
                      actualizarCampo(
                        "idPersonaContacto",
                        e.target.value
                      )
                    }
                  >
                    {personas.slice(0, 500).map((p) => (
                      <option key={p.IdPersona} value={p.IdPersona}>
                        {p.NombrePersona}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="campo-formulario-vta">
                  <label>Vendedor *</label>
                  <select
                    value={formulario.idVendedor}
                    onChange={(e) =>
                      actualizarCampo("idVendedor", e.target.value)
                    }
                    required
                  >
                    {personas.slice(0, 500).map((p) => (
                      <option key={p.IdPersona} value={p.IdPersona}>
                        {p.NombrePersona}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="campo-formulario-vta">
                  <label>Número de orden de compra</label>
                  <input
                    type="text"
                    value={formulario.numeroOrdenCompra}
                    onChange={(e) =>
                      actualizarCampo(
                        "numeroOrdenCompra",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="campo-formulario-vta ancho-completo-vta">
                  <label>Instrucciones de entrega</label>
                  <textarea
                    value={formulario.instruccionesEntrega}
                    onChange={(e) =>
                      actualizarCampo(
                        "instruccionesEntrega",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>

              <div className="seccion-lineas-vta">
                <div className="titulo-seccion-lineas-vta">
                  <h4>Líneas de la venta *</h4>
                  <button
                    type="button"
                    className="boton-agregar-linea-vta"
                    onClick={agregarLinea}
                  >
                    + Agregar línea
                  </button>
                </div>

                {formulario.lineas.map((linea, idx) => (
                  <div className="fila-linea-vta" key={idx}>
                    <div className="campo-formulario-vta">
                      <label>Producto</label>
                      <select
                        value={linea.idProducto}
                        onChange={(e) =>
                          actualizarLinea(
                            idx,
                            "idProducto",
                            e.target.value
                          )
                        }
                        required
                      >
                        <option value="">Seleccione...</option>
                        {productos.map((p) => (
                          <option
                            key={p.IdProducto}
                            value={p.IdProducto}
                          >
                            {p.NombreProducto}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="campo-formulario-vta">
                      <label>Cantidad</label>
                      <input
                        type="number"
                        min="1"
                        value={linea.cantidad}
                        onChange={(e) =>
                          actualizarLinea(
                            idx,
                            "cantidad",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>

                    <div className="campo-formulario-vta">
                      <label>Precio unit.</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={linea.precioUnitario}
                        onChange={(e) =>
                          actualizarLinea(
                            idx,
                            "precioUnitario",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>

                    <button
                      type="button"
                      className="boton-eliminar-linea-vta"
                      onClick={() => eliminarLinea(idx)}
                      disabled={formulario.lineas.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="botones-formulario-vta">
            <button
              type="button"
              className="boton-cancelar-vta"
              onClick={cerrarModalFormulario}
              disabled={guardando}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="boton-guardar-vta"
              disabled={guardando}
            >
              {guardando
                ? "Guardando..."
                : modoEdicion
                ? "Guardar cambios"
                : "Guardar venta"}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL ELIMINAR */}
      <Modal
        isOpen={modalEliminarAbierto}
        onClose={cerrarModalEliminar}
      >
        {ventaEliminando && (
          <div className="confirmar-eliminar-vta">
            <h3>¿Eliminar venta?</h3>
            <p>
              ¿Estás seguro de eliminar la factura{" "}
              <span className="nombre-eliminar-vta">
                #{ventaEliminando.NumeroFactura}
              </span>{" "}
              de {ventaEliminando.NombreCliente}? Esta acción no se puede
              deshacer.
            </p>

            <div className="botones-eliminar-vta">
              <button
                className="boton-cancelar-eliminar-vta"
                onClick={cerrarModalEliminar}
                disabled={eliminando}
              >
                Cancelar
              </button>

              <button
                className="boton-confirmar-eliminar-vta"
                onClick={confirmarEliminar}
                disabled={eliminando}
              >
                {eliminando ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}

export default Ventas;