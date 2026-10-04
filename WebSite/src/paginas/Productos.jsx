import { useEffect, useState } from "react";
import {
  buscarProductos,
  obtenerGruposProductos,
  obtenerDetalleProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerProveedores,
} from "../servicios/productos";
import Modal from "../componentes/Modal";
import "../estilos/productos.css";

const FORMULARIO_VACIO = {
  nombreProducto: "",
  idProveedor: "",
  idEmpaqueUnidad: "7",
  idEmpaqueExterior: "7",
  idColor: "",
  marca: "",
  talla: "",
  diasEntrega: "7",
  cantidadPorEmpaque: "1",
  esRefrigerado: false,
  impuesto: "15",
  precioUnitario: "0",
  precioVenta: "",
  peso: "0",
  idEditadoPor: "1361",
};

const TIPOS_EMPAQUE = [
  { id: 1, nombre: "Each" },
  { id: 2, nombre: "Box" },
  { id: 3, nombre: "Carton" },
  { id: 4, nombre: "Pair" },
  { id: 5, nombre: "Pack" },
  { id: 6, nombre: "Packet" },
  { id: 7, nombre: "Each" },
  { id: 8, nombre: "Set" },
  { id: 9, nombre: "Pallet" },
  { id: 10, nombre: "Bag" },
];

function Productos() {
  // Filtros
  const [nombre, setNombre] = useState("");
  const [grupo, setGrupo] = useState("");

  // Catálogos
  const [grupos, setGrupos] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  // Búsqueda datalist
  const [busquedaProveedor, setBusquedaProveedor] = useState("");

  // Tabla
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [tamanoPagina, setTamanoPagina] = useState(25);

  // Modal detalle
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [detalleProducto, setDetalleProducto] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  // Modal formulario
  const [modalFormularioAbierto, setModalFormularioAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [guardando, setGuardando] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState("");

  // Modal eliminar
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [productoEliminando, setProductoEliminando] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  async function cargarProductos(filtrosOverride) {
    try {
      setCargando(true);
      setError("");

      const filtros = filtrosOverride || {
        nombre: nombre,
        idGrupo: grupo === "" ? null : Number(grupo),
      };

      const datos = await buscarProductos(filtros);
      setProductos(datos);
      setPaginaActual(1);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }

  const totalPaginas = Math.ceil(productos.length / tamanoPagina);
  const indiceInicial = (paginaActual - 1) * tamanoPagina;
  const indiceFinal = indiceInicial + tamanoPagina;
  const productosPaginados = productos.slice(indiceInicial, indiceFinal);

  function irPagina(nuevaPagina) {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return;
    setPaginaActual(nuevaPagina);
  }

  function cambiarTamanoPagina(nuevoTamano) {
    setTamanoPagina(nuevoTamano);
    setPaginaActual(1);
  }

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

  async function cargarCatalogos() {
    try {
      const [gruposObtenidos, proveedoresObtenidos] = await Promise.all([
        obtenerGruposProductos(),
        obtenerProveedores(),
      ]);

      setGrupos(gruposObtenidos);
      setProveedores(proveedoresObtenidos);
    } catch (error) {
      setError(error.message);
    }
  }

  // Carga inicial
  useEffect(() => {
    cargarProductos({ nombre: "", idGrupo: null });
    cargarCatalogos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      cargarProductos({
        nombre: nombre,
        idGrupo: grupo === "" ? null : Number(grupo),
      });
    }, 400);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nombre, grupo]);

  async function limpiarFiltros() {
    setNombre("");
    setGrupo("");
  }

  // Helpers
  function resolverIdProveedor(texto) {
    if (!texto) return "";
    const encontrado = proveedores.find(
      (p) => p.NombreProveedor === texto
    );
    return encontrado ? encontrado.IdProveedor.toString() : "";
  }

  function nombreDeProveedor(id) {
    if (!id) return "";
    const encontrado = proveedores.find(
      (p) => p.IdProveedor.toString() === id.toString()
    );
    return encontrado ? encontrado.NombreProveedor : "";
  }

  // -------------------- VER DETALLE --------------------
  async function verProducto(idProducto) {
    setModalDetalleAbierto(true);
    setCargandoDetalle(true);
    setDetalleProducto(null);

    try {
      const detalle = await obtenerDetalleProducto(idProducto);
      setDetalleProducto(detalle);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargandoDetalle(false);
    }
  }

  function cerrarModalDetalle() {
    setModalDetalleAbierto(false);
    setDetalleProducto(null);
  }

  // -------------------- CREAR --------------------
  function abrirModalCrear() {
    setFormulario(FORMULARIO_VACIO);
    setBusquedaProveedor("");
    setModoEdicion(false);
    setIdEditando(null);
    setErrorFormulario("");
    setModalFormularioAbierto(true);
  }

  // -------------------- EDITAR --------------------
  async function abrirModalEditar(producto) {
    try {
      const detalle = await obtenerDetalleProducto(producto.IdProducto);

      setFormulario({
        nombreProducto: detalle.NombreProducto || "",
        idProveedor: detalle.IdProveedor?.toString() || "",
        idEmpaqueUnidad:
          detalle.IdUnidadEmpaquetamiento?.toString() || "7",
        idEmpaqueExterior:
          detalle.IdEmpaquetamiento?.toString() || "7",
        idColor: detalle.IdColor?.toString() || "",
        marca: detalle.Marca || "",
        talla: detalle.TallaTamano || "",
        diasEntrega: "7",
        cantidadPorEmpaque:
          detalle.CantidadEmpaquetamiento?.toString() || "1",
        esRefrigerado: false,
        impuesto: detalle.Impuesto?.toString() || "15",
        precioUnitario: detalle.PrecioUnitario?.toString() || "0",
        precioVenta: detalle.PrecioVenta?.toString() || "",
        peso: detalle.Peso?.toString() || "0",
        idEditadoPor: "1361",
      });

      setBusquedaProveedor(nombreDeProveedor(detalle.IdProveedor));
      setModoEdicion(true);
      setIdEditando(producto.IdProducto);
      setErrorFormulario("");
      setModalFormularioAbierto(true);
    } catch (error) {
      setError(error.message);
    }
  }

  function cerrarModalFormulario() {
    setModalFormularioAbierto(false);
    setFormulario(FORMULARIO_VACIO);
    setBusquedaProveedor("");
    setModoEdicion(false);
    setIdEditando(null);
    setErrorFormulario("");
  }

  function actualizarCampo(nombreCampo, valor) {
    setFormulario((prev) => ({
      ...prev,
      [nombreCampo]: valor,
    }));
  }

  async function guardarProducto(evento) {
    evento.preventDefault();
    setErrorFormulario("");

    if (!formulario.nombreProducto.trim()) {
      setErrorFormulario("El nombre del producto es obligatorio.");
      return;
    }

    // ---------- VALIDACIONES NUMÉRICAS ----------
    const numCampos = {
      idColor: "Color",
      diasEntrega: "Días de entrega",
      cantidadPorEmpaque: "Cantidad por empaque",
      impuesto: "Impuesto",
      precioUnitario: "Precio unitario",
      precioVenta: "Precio venta",
      peso: "Peso",
    };

    for (const [campo, etiqueta] of Object.entries(numCampos)) {
      const valor = formulario[campo];
      if (valor !== "" && valor !== null && Number(valor) < 0) {
        setErrorFormulario(
          `El campo "${etiqueta}" no puede ser negativo.`
        );
        return;
      }
    }

    if (
      formulario.idColor !== "" &&
      Number(formulario.idColor) < 1
    ) {
      setErrorFormulario(
        "El ID de color debe ser un número positivo (o dejarlo vacío)."
      );
      return;
    }

    if (
      formulario.cantidadPorEmpaque !== "" &&
      Number(formulario.cantidadPorEmpaque) < 1
    ) {
      setErrorFormulario(
        "La cantidad por empaque debe ser al menos 1."
      );
      return;
    }

    if (!modoEdicion) {
      if (!formulario.idProveedor) {
        setErrorFormulario("Debe seleccionar un proveedor válido.");
        return;
      }
      if (!formulario.idEmpaqueUnidad) {
        setErrorFormulario(
          "La unidad de empaquetamiento es obligatoria."
        );
        return;
      }
      if (!formulario.idEmpaqueExterior) {
        setErrorFormulario("El empaquetamiento es obligatorio.");
        return;
      }
    }

    try {
      setGuardando(true);

      const payload = {
        nombreProducto: formulario.nombreProducto.trim(),
        idProveedor: formulario.idProveedor
          ? Number(formulario.idProveedor)
          : null,
        idEmpaqueUnidad: formulario.idEmpaqueUnidad
          ? Number(formulario.idEmpaqueUnidad)
          : 7,
        idEmpaqueExterior: formulario.idEmpaqueExterior
          ? Number(formulario.idEmpaqueExterior)
          : 7,
        idEditadoPor: Number(formulario.idEditadoPor),
        idColor: formulario.idColor
          ? Number(formulario.idColor)
          : null,
        marca: formulario.marca.trim() || null,
        talla: formulario.talla.trim() || null,
        diasEntrega: formulario.diasEntrega
          ? Number(formulario.diasEntrega)
          : 7,
        cantidadPorEmpaque: formulario.cantidadPorEmpaque
          ? Number(formulario.cantidadPorEmpaque)
          : 1,
        esRefrigerado: formulario.esRefrigerado ? 1 : 0,
        impuesto: formulario.impuesto
          ? Number(formulario.impuesto)
          : 15,
        precioUnitario: formulario.precioUnitario
          ? Number(formulario.precioUnitario)
          : 0,
        precioVenta: formulario.precioVenta
          ? Number(formulario.precioVenta)
          : null,
        peso: formulario.peso ? Number(formulario.peso) : 0,
      };

      if (modoEdicion) {
        await actualizarProducto(idEditando, payload);
      } else {
        await crearProducto(payload);
      }

      cerrarModalFormulario();
      await cargarProductos();
    } catch (error) {
      setErrorFormulario(error.message);
    } finally {
      setGuardando(false);
    }
  }

  // -------------------- ELIMINAR --------------------
  function abrirModalEliminar(producto) {
    setProductoEliminando(producto);
    setModalEliminarAbierto(true);
  }

  function cerrarModalEliminar() {
    setModalEliminarAbierto(false);
    setProductoEliminando(null);
  }

  async function confirmarEliminar() {
    if (!productoEliminando) return;

    try {
      setEliminando(true);
      await eliminarProducto(productoEliminando.IdProducto);
      cerrarModalEliminar();
      await cargarProductos();
    } catch (error) {
      setError(error.message);
      cerrarModalEliminar();
    } finally {
      setEliminando(false);
    }
  }

  return (
    <main className="contenido-productos">
      <section className="encabezado-productos">
        <div>
          <h2>Productos</h2>
          <p>Administración de productos del sistema.</p>
        </div>

        <button
          className="boton-principal-prod"
          onClick={abrirModalCrear}
        >
          Agregar producto
        </button>
      </section>

      <section className="seccion-filtros-prod">
        <div className="grupo-filtro-prod">
          <label>Nombre</label>
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={nombre}
            onChange={(evento) => setNombre(evento.target.value)}
          />
        </div>

        <div className="grupo-filtro-prod">
          <label>Grupo</label>
          <select
            value={grupo}
            onChange={(evento) => setGrupo(evento.target.value)}
          >
            <option value="">Todos</option>
            {grupos.map((g) => (
              <option key={g.IdGrupo} value={g.IdGrupo}>
                {g.NombreGrupo}
              </option>
            ))}
          </select>
        </div>

        <div className="grupo-filtro-prod grupo-boton-prod">
          <button
            className="boton-secundario-prod"
            onClick={() => cargarProductos()}
          >
            Buscar
          </button>
        </div>

        <div className="grupo-filtro-prod grupo-boton-prod">
          <button
            className="boton-secundario-prod"
            onClick={limpiarFiltros}
          >
            Limpiar filtros
          </button>
        </div>
      </section>

      <section className="seccion-tabla-prod">
        <div className="titulo-tabla-prod">
          <div>
            <h3>Listado de productos</h3>
            <p>Productos registrados en el sistema.</p>
          </div>

          <span className="cantidad-prod">
            {productos.length} productos
          </span>
        </div>

        {error && <div className="mensaje-error-prod">{error}</div>}

        {cargando ? (
          <div className="mensaje-cargando-prod">
            Cargando productos...
          </div>
        ) : (
          <div className="contenedor-tabla-prod">
            <table className="tabla-prod">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Grupo</th>
                  <th>Cantidad en inventario</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {productos.length > 0 ? (
                  productosPaginados.map((producto) => (
                    <tr key={producto.IdProducto}>
                      <td>{producto.NombreProducto}</td>
                      <td>{producto.GrupoProducto || "—"}</td>
                      <td>{producto.CantidadEnInventario ?? 0}</td>
                      <td>
                        <div className="acciones-prod">
                          <button
                            className="boton-ver-prod"
                            onClick={() =>
                              verProducto(producto.IdProducto)
                            }
                          >
                            Ver
                          </button>

                          <button
                            className="boton-editar-prod"
                            onClick={() =>
                              abrirModalEditar(producto)
                            }
                          >
                            Editar
                          </button>

                          <button
                            className="boton-eliminar-prod"
                            onClick={() =>
                              abrirModalEliminar(producto)
                            }
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="sin-resultados-prod">
                      No se encontraron productos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {totalPaginas > 1 && (
              <div className="paginacion-productos">
                <div className="paginacion-info-productos">
                  Mostrando {indiceInicial + 1} a{" "}
                  {Math.min(indiceFinal, productos.length)} de {productos.length}
                </div>

                <div className="paginacion-controles-productos">
                  <button
                    className="boton-pagina-productos"
                    onClick={() => irPagina(1)}
                    disabled={paginaActual === 1}
                  >
                    «
                  </button>

                  <button
                    className="boton-pagina-productos"
                    onClick={() => irPagina(paginaActual - 1)}
                    disabled={paginaActual === 1}
                  >
                    ‹ Anterior
                  </button>

                  {generarPaginas().map((num) => (
                    <button
                      key={num}
                      className={`boton-pagina-productos ${
                        num === paginaActual ? "pagina-activa-productos" : ""
                      }`}
                      onClick={() => irPagina(num)}
                    >
                      {num}
                    </button>
                  ))}

                  <button
                    className="boton-pagina-productos"
                    onClick={() => irPagina(paginaActual + 1)}
                    disabled={paginaActual === totalPaginas}
                  >
                    Siguiente ›
                  </button>

                  <button
                    className="boton-pagina-productos"
                    onClick={() => irPagina(totalPaginas)}
                    disabled={paginaActual === totalPaginas}
                  >
                    »
                  </button>
                </div>

                <div className="paginacion-tamano-productos">
                  <label>Por página:</label>
                  <select
                    value={tamanoPagina}
                    onChange={(e) => cambiarTamanoPagina(Number(e.target.value))}
                  >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={250}>250</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* MODAL DETALLE */}
      <Modal
        isOpen={modalDetalleAbierto}
        onClose={cerrarModalDetalle}
      >
        {cargandoDetalle ? (
          <p>Cargando detalle...</p>
        ) : detalleProducto ? (
          <div className="detalle-prod">
            <h3>{detalleProducto.NombreProducto}</h3>
            <p className="subtitulo-prod">
              Producto #{detalleProducto.IdProducto}
            </p>

            <div className="grid-detalle-prod">
              <div className="campo-prod">
                <span className="campo-etiqueta-prod">Proveedor</span>
                <span className="campo-valor-prod">
                  {detalleProducto.NombreProveedor || "—"}
                </span>
              </div>

              <div className="campo-prod">
                <span className="campo-etiqueta-prod">Color</span>
                <span className="campo-valor-prod">
                  {detalleProducto.Color || "—"}
                </span>
              </div>

              <div className="campo-prod">
                <span className="campo-etiqueta-prod">
                  Unidad de empaquetamiento
                </span>
                <span className="campo-valor-prod">
                  {detalleProducto.UnidadEmpaquetamiento || "—"}
                </span>
              </div>

              <div className="campo-prod">
                <span className="campo-etiqueta-prod">Empaquetamiento</span>
                <span className="campo-valor-prod">
                  {detalleProducto.Empaquetamiento || "—"}
                </span>
              </div>

              <div className="campo-prod">
                <span className="campo-etiqueta-prod">
                  Cantidad de empaquetamiento
                </span>
                <span className="campo-valor-prod">
                  {detalleProducto.CantidadEmpaquetamiento ?? "—"}
                </span>
              </div>

              <div className="campo-prod">
                <span className="campo-etiqueta-prod">Marca</span>
                <span className="campo-valor-prod">
                  {detalleProducto.Marca || "—"}
                </span>
              </div>

              <div className="campo-prod">
                <span className="campo-etiqueta-prod">Talla / Tamaño</span>
                <span className="campo-valor-prod">
                  {detalleProducto.TallaTamano || "—"}
                </span>
              </div>

              <div className="campo-prod">
                <span className="campo-etiqueta-prod">Impuesto</span>
                <span className="campo-valor-prod">
                  {detalleProducto.Impuesto ?? "—"}
                </span>
              </div>

              <div className="campo-prod">
                <span className="campo-etiqueta-prod">Precio unitario</span>
                <span className="campo-valor-prod">
                  {detalleProducto.PrecioUnitario ?? "—"}
                </span>
              </div>

              <div className="campo-prod">
                <span className="campo-etiqueta-prod">Precio venta</span>
                <span className="campo-valor-prod">
                  {detalleProducto.PrecioVenta ?? "—"}
                </span>
              </div>

              <div className="campo-prod">
                <span className="campo-etiqueta-prod">Peso</span>
                <span className="campo-valor-prod">
                  {detalleProducto.Peso ?? "—"}
                </span>
              </div>

              <div className="campo-prod">
                <span className="campo-etiqueta-prod">
                  Cantidad disponible
                </span>
                <span className="campo-valor-prod">
                  {detalleProducto.CantidadDisponible ?? "—"}
                </span>
              </div>

              <div className="campo-prod campo-ancho-prod">
                <span className="campo-etiqueta-prod">Palabras clave</span>
                <span className="campo-valor-prod">
                  {detalleProducto.PalabrasClave || "—"}
                </span>
              </div>

              <div className="campo-prod">
                <span className="campo-etiqueta-prod">Ubicación</span>
                <span className="campo-valor-prod">
                  {detalleProducto.Ubicacion || "—"}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* MODAL CREAR / EDITAR */}
      <Modal
        isOpen={modalFormularioAbierto}
        onClose={cerrarModalFormulario}
      >
        <form
          className="formulario-prod"
          onSubmit={guardarProducto}
        >
          <h3>{modoEdicion ? "Editar producto" : "Nuevo producto"}</h3>

          {errorFormulario && (
            <div className="mensaje-error-prod">{errorFormulario}</div>
          )}

          <div className="formulario-grid-prod">
            <div className="campo-formulario-prod ancho-completo-prod">
              <label>Nombre del producto *</label>
              <input
                type="text"
                value={formulario.nombreProducto}
                onChange={(e) =>
                  actualizarCampo("nombreProducto", e.target.value)
                }
                required
              />
            </div>

            {/* Proveedor */}
            <div className="campo-formulario-prod">
              <label>Proveedor {!modoEdicion && "*"}</label>
              <input
                type="text"
                list="lista-proveedores-prod"
                value={busquedaProveedor}
                onChange={(e) => {
                  const texto = e.target.value;
                  setBusquedaProveedor(texto);
                  const id = resolverIdProveedor(texto);
                  actualizarCampo("idProveedor", id);
                }}
                placeholder="Escriba para buscar..."
                required={!modoEdicion}
              />
              <datalist id="lista-proveedores-prod">
                {proveedores.map((p) => (
                  <option key={p.IdProveedor} value={p.NombreProveedor} />
                ))}
              </datalist>
            </div>

            <div className="campo-formulario-prod">
              <label>Unidad de empaquetamiento {!modoEdicion && "*"}</label>
              <select
                value={formulario.idEmpaqueUnidad}
                onChange={(e) =>
                  actualizarCampo("idEmpaqueUnidad", e.target.value)
                }
                required={!modoEdicion}
              >
                {TIPOS_EMPAQUE.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.id} - {t.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="campo-formulario-prod">
              <label>Empaquetamiento {!modoEdicion && "*"}</label>
              <select
                value={formulario.idEmpaqueExterior}
                onChange={(e) =>
                  actualizarCampo("idEmpaqueExterior", e.target.value)
                }
                required={!modoEdicion}
              >
                {TIPOS_EMPAQUE.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.id} - {t.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="campo-formulario-prod">
              <label>Color (ID numérico)</label>
              <input
                type="number"
                min="1"
                value={formulario.idColor}
                onChange={(e) =>
                  actualizarCampo("idColor", e.target.value)
                }
                placeholder="Dejar vacío para sin color"
              />
            </div>

            <div className="campo-formulario-prod">
              <label>Marca</label>
              <input
                type="text"
                value={formulario.marca}
                onChange={(e) =>
                  actualizarCampo("marca", e.target.value)
                }
              />
            </div>

            <div className="campo-formulario-prod">
              <label>Talla / Tamaño</label>
              <input
                type="text"
                value={formulario.talla}
                onChange={(e) =>
                  actualizarCampo("talla", e.target.value)
                }
              />
            </div>

            <div className="campo-formulario-prod">
              <label>Días de entrega</label>
              <input
                type="number"
                min="0"
                value={formulario.diasEntrega}
                onChange={(e) =>
                  actualizarCampo("diasEntrega", e.target.value)
                }
              />
            </div>

            <div className="campo-formulario-prod">
              <label>Cantidad por empaque</label>
              <input
                type="number"
                min="1"
                value={formulario.cantidadPorEmpaque}
                onChange={(e) =>
                  actualizarCampo("cantidadPorEmpaque", e.target.value)
                }
              />
            </div>

            <div className="campo-formulario-prod">
              <label>Impuesto (%)</label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={formulario.impuesto}
                onChange={(e) =>
                  actualizarCampo("impuesto", e.target.value)
                }
              />
            </div>

            <div className="campo-formulario-prod">
              <label>Precio unitario</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formulario.precioUnitario}
                onChange={(e) =>
                  actualizarCampo("precioUnitario", e.target.value)
                }
              />
            </div>

            <div className="campo-formulario-prod">
              <label>Precio venta</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formulario.precioVenta}
                onChange={(e) =>
                  actualizarCampo("precioVenta", e.target.value)
                }
              />
            </div>

            <div className="campo-formulario-prod">
              <label>Peso</label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={formulario.peso}
                onChange={(e) =>
                  actualizarCampo("peso", e.target.value)
                }
              />
            </div>

            <div className="campo-formulario-prod ancho-completo-prod">
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <input
                  type="checkbox"
                  checked={formulario.esRefrigerado}
                  onChange={(e) =>
                    actualizarCampo("esRefrigerado", e.target.checked)
                  }
                  style={{ width: "auto", height: "auto" }}
                />
                Es producto refrigerado
              </label>
            </div>
          </div>

          <div className="botones-formulario-prod">
            <button
              type="button"
              className="boton-cancelar-prod"
              onClick={cerrarModalFormulario}
              disabled={guardando}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="boton-guardar-prod"
              disabled={guardando}
            >
              {guardando
                ? "Guardando..."
                : modoEdicion
                ? "Guardar cambios"
                : "Guardar producto"}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL ELIMINAR */}
      <Modal
        isOpen={modalEliminarAbierto}
        onClose={cerrarModalEliminar}
      >
        {productoEliminando && (
          <div className="confirmar-eliminar-prod">
            <h3>¿Eliminar producto?</h3>
            <p>
              ¿Estás seguro de eliminar el producto{" "}
              <span className="nombre-eliminar-prod">
                {productoEliminando.NombreProducto}
              </span>
              ? Esta acción no se puede deshacer.
            </p>

            <div className="botones-eliminar-prod">
              <button
                className="boton-cancelar-eliminar-prod"
                onClick={cerrarModalEliminar}
                disabled={eliminando}
              >
                Cancelar
              </button>

              <button
                className="boton-confirmar-eliminar-prod"
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

export default Productos;