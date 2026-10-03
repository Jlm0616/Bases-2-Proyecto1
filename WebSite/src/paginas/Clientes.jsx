import { useEffect, useState } from "react";
import {
  buscarClientes,
  obtenerCategoriasCliente,
  obtenerMetodosEntrega,
  obtenerDetalleCliente,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
  obtenerPersonas,
  obtenerCiudades,
  obtenerGruposCompra,
} from "../servicios/clientes";
import Modal from "../componentes/Modal";
import "../estilos/clientes.css";

const FORMULARIO_VACIO = {
  nombreCliente: "",
  idCategoria: "",
  idMetodoEntrega: "",
  idContactoPrimario: "",
  idCiudadEntrega: "",
  idCiudadPostal: "",
  idGrupoCompra: "",
  telefono: "",
  direccionEntregaLinea1: "",
  codigoPostalEntrega: "",
  direccionPostalLinea1: "",
  codigoPostal: "",
  idEditadoPor: "1361",
};

function Clientes() {
  // Filtros
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [metodoEntrega, setMetodoEntrega] = useState("");

  // Catálogos
  const [categorias, setCategorias] = useState([]);
  const [metodosEntrega, setMetodosEntrega] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [gruposCompra, setGruposCompra] = useState([]);

  // Búsquedas de datalist (texto que escribe el usuario)
  const [busquedaContacto, setBusquedaContacto] = useState("");
  const [busquedaCiudadEntrega, setBusquedaCiudadEntrega] = useState("");
  const [busquedaCiudadPostal, setBusquedaCiudadPostal] = useState("");

  // Tabla
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  // Modal detalle
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [detalleCliente, setDetalleCliente] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  // Modal formulario (crear / editar)
  const [modalFormularioAbierto, setModalFormularioAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [guardando, setGuardando] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState("");

  // Modal eliminar
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [clienteEliminando, setClienteEliminando] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  async function cargarClientes(filtrosOverride) {
    try {
      setCargando(true);
      setError("");

      const filtros = filtrosOverride || {
        nombre: nombre,
        idCategoria: categoria === "" ? null : Number(categoria),
        idMetodoEntrega:
          metodoEntrega === "" ? null : Number(metodoEntrega),
      };

      const datos = await buscarClientes(filtros);
      setClientes(datos);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }

  async function cargarCatalogos() {
    try {
      const [
        categoriasObtenidas,
        metodosObtenidos,
        personasObtenidas,
        ciudadesObtenidas,
        gruposObtenidos,
      ] = await Promise.all([
        obtenerCategoriasCliente(),
        obtenerMetodosEntrega(),
        obtenerPersonas(),
        obtenerCiudades(),
        obtenerGruposCompra(),
      ]);

      setCategorias(categoriasObtenidas);
      setMetodosEntrega(metodosObtenidos);
      setPersonas(personasObtenidas);
      setCiudades(ciudadesObtenidas);
      setGruposCompra(gruposObtenidos);
    } catch (error) {
      setError(error.message);
    }
  }

  // Carga inicial (solo una vez)
  useEffect(() => {
    cargarClientes({
      nombre: "",
      idCategoria: null,
      idMetodoEntrega: null,
    });
    cargarCatalogos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // DEBOUNCE: buscar automáticamente 400ms después de la última tecla
  useEffect(() => {
    const timer = setTimeout(() => {
      cargarClientes({
        nombre: nombre,
        idCategoria: categoria === "" ? null : Number(categoria),
        idMetodoEntrega:
          metodoEntrega === "" ? null : Number(metodoEntrega),
      });
    }, 400);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nombre, categoria, metodoEntrega]);

  async function limpiarFiltros() {
    setNombre("");
    setCategoria("");
    setMetodoEntrega("");
    // El useEffect del debounce se encargará de recargar
  }

  // -------------------- HELPERS DATALIST --------------------
  function resolverIdPersona(texto) {
    if (!texto) return "";
    const encontrada = personas.find((p) => p.NombrePersona === texto);
    return encontrada ? encontrada.IdPersona.toString() : "";
  }

  function resolverIdCiudad(texto) {
    if (!texto) return "";
    const encontrada = ciudades.find((c) => c.NombreCiudad === texto);
    return encontrada ? encontrada.IdCiudad.toString() : "";
  }

  function nombreDePersona(id) {
    if (!id) return "";
    const encontrada = personas.find(
      (p) => p.IdPersona.toString() === id.toString()
    );
    return encontrada ? encontrada.NombrePersona : "";
  }

  function nombreDeCiudad(id) {
    if (!id) return "";
    const encontrada = ciudades.find(
      (c) => c.IdCiudad.toString() === id.toString()
    );
    return encontrada ? encontrada.NombreCiudad : "";
  }

  // -------------------- VER DETALLE --------------------
  async function verCliente(idCliente) {
    setModalDetalleAbierto(true);
    setCargandoDetalle(true);
    setDetalleCliente(null);

    try {
      const detalle = await obtenerDetalleCliente(idCliente);
      setDetalleCliente(detalle);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargandoDetalle(false);
    }
  }

  function cerrarModalDetalle() {
    setModalDetalleAbierto(false);
    setDetalleCliente(null);
  }

  // -------------------- CREAR --------------------
  function abrirModalCrear() {
    setFormulario(FORMULARIO_VACIO);
    setBusquedaContacto("");
    setBusquedaCiudadEntrega("");
    setBusquedaCiudadPostal("");
    setModoEdicion(false);
    setIdEditando(null);
    setErrorFormulario("");
    setModalFormularioAbierto(true);
  }

  // -------------------- EDITAR --------------------
  async function abrirModalEditar(cliente) {
    try {
      const detalle = await obtenerDetalleCliente(cliente.IdCliente);

      setFormulario({
        nombreCliente: detalle.NombreCliente || "",
        idCategoria: detalle.IdCategoria?.toString() || "",
        idMetodoEntrega: detalle.IdMetodoEntrega?.toString() || "",
        idContactoPrimario: detalle.IdContactoPrimario?.toString() || "",
        idCiudadEntrega: detalle.IdCiudadEntrega?.toString() || "",
        idCiudadPostal: "",
        idGrupoCompra: detalle.IdGrupoCompra?.toString() || "",
        telefono: detalle.Telefono || "",
        direccionEntregaLinea1: detalle.DireccionEntregaLinea1 || "",
        codigoPostalEntrega: detalle.CodigoPostalEntrega || "",
        direccionPostalLinea1: detalle.DireccionPostalLinea1 || "",
        codigoPostal: detalle.CodigoPostalPostal || "",
        idEditadoPor: "1361",
      });

      // Pre-llenar los datalists con el nombre actual
      setBusquedaContacto(nombreDePersona(detalle.IdContactoPrimario));
      setBusquedaCiudadEntrega(nombreDeCiudad(detalle.IdCiudadEntrega));
      setBusquedaCiudadPostal("");

      setModoEdicion(true);
      setIdEditando(cliente.IdCliente);
      setErrorFormulario("");
      setModalFormularioAbierto(true);
    } catch (error) {
      setError(error.message);
    }
  }

  function cerrarModalFormulario() {
    setModalFormularioAbierto(false);
    setFormulario(FORMULARIO_VACIO);
    setBusquedaContacto("");
    setBusquedaCiudadEntrega("");
    setBusquedaCiudadPostal("");
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

  async function guardarCliente(evento) {
    evento.preventDefault();
    setErrorFormulario("");

    if (!formulario.nombreCliente.trim()) {
      setErrorFormulario("El nombre del cliente es obligatorio.");
      return;
    }
    if (!modoEdicion) {
      if (!formulario.idCategoria) {
        setErrorFormulario("La categoría es obligatoria.");
        return;
      }
      if (!formulario.idMetodoEntrega) {
        setErrorFormulario("El método de entrega es obligatorio.");
        return;
      }
      if (!formulario.idContactoPrimario) {
        setErrorFormulario(
          "Debe seleccionar un contacto primario válido."
        );
        return;
      }
      if (!formulario.idCiudadEntrega) {
        setErrorFormulario(
          "Debe seleccionar una ciudad de entrega válida."
        );
        return;
      }
    }

    try {
      setGuardando(true);

      const payload = {
        nombreCliente: formulario.nombreCliente.trim(),
        idCategoria: formulario.idCategoria
          ? Number(formulario.idCategoria)
          : null,
        idMetodoEntrega: formulario.idMetodoEntrega
          ? Number(formulario.idMetodoEntrega)
          : null,
        idContactoPrimario: formulario.idContactoPrimario
          ? Number(formulario.idContactoPrimario)
          : null,
        idCiudadEntrega: formulario.idCiudadEntrega
          ? Number(formulario.idCiudadEntrega)
          : null,
        idEditadoPor: Number(formulario.idEditadoPor),
        idCiudadPostal: formulario.idCiudadPostal
          ? Number(formulario.idCiudadPostal)
          : null,
        idGrupoCompra: formulario.idGrupoCompra
          ? Number(formulario.idGrupoCompra)
          : null,
        telefono: formulario.telefono.trim() || "Sin definir",
        direccionEntregaLinea1:
          formulario.direccionEntregaLinea1.trim() || "Sin definir",
        codigoPostalEntrega:
          formulario.codigoPostalEntrega.trim() || "00000",
        direccionPostalLinea1:
          formulario.direccionPostalLinea1.trim() || "Sin definir",
        codigoPostal: formulario.codigoPostal.trim() || "00000",
      };

      if (modoEdicion) {
        await actualizarCliente(idEditando, payload);
      } else {
        await crearCliente(payload);
      }

      cerrarModalFormulario();
      await cargarClientes();
    } catch (error) {
      setErrorFormulario(error.message);
    } finally {
      setGuardando(false);
    }
  }

  // -------------------- ELIMINAR --------------------
  function abrirModalEliminar(cliente) {
    setClienteEliminando(cliente);
    setModalEliminarAbierto(true);
  }

  function cerrarModalEliminar() {
    setModalEliminarAbierto(false);
    setClienteEliminando(null);
  }

  async function confirmarEliminar() {
    if (!clienteEliminando) return;

    try {
      setEliminando(true);
      await eliminarCliente(clienteEliminando.IdCliente);
      cerrarModalEliminar();
      await cargarClientes();
    } catch (error) {
      setError(error.message);
      cerrarModalEliminar();
    } finally {
      setEliminando(false);
    }
  }

  return (
    <main className="contenido-clientes">
      <section className="encabezado-clientes">
        <div>
          <h2>Clientes</h2>
          <p>Administración de clientes del sistema.</p>
        </div>

        <button
          className="boton-principal"
          onClick={abrirModalCrear}
        >
          Agregar cliente
        </button>
      </section>

      <section className="seccion-filtros">
        <div className="grupo-filtro">
          <label>Nombre</label>
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={nombre}
            onChange={(evento) => setNombre(evento.target.value)}
          />
        </div>

        <div className="grupo-filtro">
          <label>Categoría</label>
          <select
            value={categoria}
            onChange={(evento) => setCategoria(evento.target.value)}
          >
            <option value="">Todas</option>
            {categorias.map((c) => (
              <option key={c.IdCategoria} value={c.IdCategoria}>
                {c.NombreCategoria}
              </option>
            ))}
          </select>
        </div>

        <div className="grupo-filtro">
          <label>Método de entrega</label>
          <select
            value={metodoEntrega}
            onChange={(evento) =>
              setMetodoEntrega(evento.target.value)
            }
          >
            <option value="">Todos</option>
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

        <div className="grupo-filtro grupo-boton">
          <button
            className="boton-secundario"
            onClick={() => cargarClientes()}
          >
            Buscar
          </button>
        </div>

        <div className="grupo-filtro grupo-boton">
          <button
            className="boton-secundario"
            onClick={limpiarFiltros}
          >
            Limpiar filtros
          </button>
        </div>
      </section>

      <section className="seccion-tabla-clientes">
        <div className="titulo-tabla-clientes">
          <div>
            <h3>Listado de clientes</h3>
            <p>Clientes registrados en el sistema.</p>
          </div>

          <span className="cantidad-clientes">
            {clientes.length} clientes
          </span>
        </div>

        {error && <div className="mensaje-error">{error}</div>}

        {cargando ? (
          <div className="mensaje-cargando">
            Cargando clientes...
          </div>
        ) : (
          <div className="contenedor-tabla-clientes">
            <table className="tabla-clientes">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Método de entrega</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {clientes.length > 0 ? (
                  clientes.map((cliente) => (
                    <tr key={cliente.IdCliente}>
                      <td>{cliente.NombreCliente}</td>
                      <td>{cliente.CategoriaCliente}</td>
                      <td>{cliente.MetodoEntrega}</td>
                      <td>
                        <div className="acciones-clientes">
                          <button
                            className="boton-ver"
                            onClick={() =>
                              verCliente(cliente.IdCliente)
                            }
                          >
                            Ver
                          </button>

                          <button
                            className="boton-editar"
                            onClick={() =>
                              abrirModalEditar(cliente)
                            }
                          >
                            Editar
                          </button>

                          <button
                            className="boton-eliminar"
                            onClick={() =>
                              abrirModalEliminar(cliente)
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
                    <td colSpan="4" className="sin-resultados">
                      No se encontraron clientes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
        ) : detalleCliente ? (
          <div className="detalle-cliente">
            <h3>{detalleCliente.NombreCliente}</h3>
            <p className="subtitulo">
              Cliente #{detalleCliente.IdCliente}
            </p>

            <div className="grid-detalle">
              <div className="campo">
                <span className="campo-etiqueta">Categoría</span>
                <span className="campo-valor">
                  {detalleCliente.CategoriaCliente || "—"}
                </span>
              </div>

              <div className="campo">
                <span className="campo-etiqueta">Grupo de compra</span>
                <span className="campo-valor">
                  {detalleCliente.GrupoCompra || "—"}
                </span>
              </div>

              <div className="campo">
                <span className="campo-etiqueta">Contacto primario</span>
                <span className="campo-valor">
                  {detalleCliente.ContactoPrimario || "—"}
                </span>
              </div>

              <div className="campo">
                <span className="campo-etiqueta">
                  Contacto alternativo
                </span>
                <span className="campo-valor">
                  {detalleCliente.ContactoAlternativo || "—"}
                </span>
              </div>

              <div className="campo">
                <span className="campo-etiqueta">
                  Cliente por facturar
                </span>
                <span className="campo-valor">
                  {detalleCliente.IdClienteFacturar ?? "—"}
                </span>
              </div>

              <div className="campo">
                <span className="campo-etiqueta">Método de entrega</span>
                <span className="campo-valor">
                  {detalleCliente.MetodoEntrega || "—"}
                </span>
              </div>

              <div className="campo">
                <span className="campo-etiqueta">Ciudad de entrega</span>
                <span className="campo-valor">
                  {detalleCliente.CiudadEntrega || "—"}
                </span>
              </div>

              <div className="campo">
                <span className="campo-etiqueta">Código postal</span>
                <span className="campo-valor">
                  {detalleCliente.CodigoPostalEntrega || "—"}
                </span>
              </div>

              <div className="campo">
                <span className="campo-etiqueta">Teléfono</span>
                <span className="campo-valor">
                  {detalleCliente.Telefono || "—"}
                </span>
              </div>

              <div className="campo">
                <span className="campo-etiqueta">Fax</span>
                <span className="campo-valor">
                  {detalleCliente.Fax || "—"}
                </span>
              </div>

              <div className="campo">
                <span className="campo-etiqueta">
                  Días de gracia para pagar
                </span>
                <span className="campo-valor">
                  {detalleCliente.DiasGraciaPago ?? "—"}
                </span>
              </div>

              <div className="campo">
                <span className="campo-etiqueta">Sitio web</span>
                <span className="campo-valor">
                  {detalleCliente.SitioWeb ? (
                    <a
                      href={detalleCliente.SitioWeb}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {detalleCliente.SitioWeb}
                    </a>
                  ) : (
                    "—"
                  )}
                </span>
              </div>

              <div className="campo campo-ancho">
                <span className="campo-etiqueta">
                  Dirección de entrega
                </span>
                <span className="campo-valor">
                  {detalleCliente.DireccionEntregaLinea1 || "—"}
                  {detalleCliente.DireccionEntregaLinea2 &&
                    `, ${detalleCliente.DireccionEntregaLinea2}`}
                </span>
              </div>

              <div className="campo campo-ancho">
                <span className="campo-etiqueta">
                  Dirección postal
                </span>
                <span className="campo-valor">
                  {detalleCliente.DireccionPostalLinea1 || "—"}
                  {detalleCliente.DireccionPostalLinea2 &&
                    `, ${detalleCliente.DireccionPostalLinea2}`}
                </span>
              </div>

              <div className="campo campo-ancho">
                <span className="campo-etiqueta">
                  Ubicación en el mapa
                </span>
                <span className="campo-valor">
                  {detalleCliente.UbicacionEntregaMapa || "—"}
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
          className="formulario-cliente"
          onSubmit={guardarCliente}
        >
          <h3>{modoEdicion ? "Editar cliente" : "Nuevo cliente"}</h3>

          {errorFormulario && (
            <div className="mensaje-error">{errorFormulario}</div>
          )}

          <div className="formulario-grid">
            <div className="campo-formulario ancho-completo">
              <label>Nombre del cliente *</label>
              <input
                type="text"
                value={formulario.nombreCliente}
                onChange={(e) =>
                  actualizarCampo("nombreCliente", e.target.value)
                }
                required
              />
            </div>

            <div className="campo-formulario">
              <label>Categoría {!modoEdicion && "*"}</label>
              <select
                value={formulario.idCategoria}
                onChange={(e) =>
                  actualizarCampo("idCategoria", e.target.value)
                }
                required={!modoEdicion}
              >
                <option value="">Seleccione...</option>
                {categorias.map((c) => (
                  <option key={c.IdCategoria} value={c.IdCategoria}>
                    {c.NombreCategoria}
                  </option>
                ))}
              </select>
            </div>

            <div className="campo-formulario">
              <label>Método de entrega {!modoEdicion && "*"}</label>
              <select
                value={formulario.idMetodoEntrega}
                onChange={(e) =>
                  actualizarCampo("idMetodoEntrega", e.target.value)
                }
                required={!modoEdicion}
              >
                <option value="">Seleccione...</option>
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

            {/* Contacto primario: input + datalist */}
            <div className="campo-formulario">
              <label>Contacto primario {!modoEdicion && "*"}</label>
              <input
                type="text"
                list="lista-personas"
                value={busquedaContacto}
                onChange={(e) => {
                  const texto = e.target.value;
                  setBusquedaContacto(texto);
                  const id = resolverIdPersona(texto);
                  actualizarCampo("idContactoPrimario", id);
                }}
                placeholder="Escriba para buscar..."
                required={!modoEdicion}
              />
              <datalist id="lista-personas">
                {personas.slice(0, 200).map((p) => (
                  <option key={p.IdPersona} value={p.NombrePersona} />
                ))}
              </datalist>
            </div>

            <div className="campo-formulario">
              <label>Grupo de compra</label>
              <select
                value={formulario.idGrupoCompra}
                onChange={(e) =>
                  actualizarCampo("idGrupoCompra", e.target.value)
                }
              >
                <option value="">Sin grupo</option>
                {gruposCompra.map((g) => (
                  <option
                    key={g.IdGrupoCompra}
                    value={g.IdGrupoCompra}
                  >
                    {g.NombreGrupoCompra}
                  </option>
                ))}
              </select>
            </div>

            {/* Ciudad de entrega: input + datalist */}
            <div className="campo-formulario">
              <label>Ciudad de entrega {!modoEdicion && "*"}</label>
              <input
                type="text"
                list="lista-ciudades"
                value={busquedaCiudadEntrega}
                onChange={(e) => {
                  const texto = e.target.value;
                  setBusquedaCiudadEntrega(texto);
                  const id = resolverIdCiudad(texto);
                  actualizarCampo("idCiudadEntrega", id);
                }}
                placeholder="Escriba para buscar..."
                required={!modoEdicion}
              />
              <datalist id="lista-ciudades">
                {ciudades.slice(0, 500).map((c) => (
                  <option key={c.IdCiudad} value={c.NombreCiudad} />
                ))}
              </datalist>
            </div>

            {/* Ciudad postal: input + datalist */}
            <div className="campo-formulario">
              <label>Ciudad postal</label>
              <input
                type="text"
                list="lista-ciudades"
                value={busquedaCiudadPostal}
                onChange={(e) => {
                  const texto = e.target.value;
                  setBusquedaCiudadPostal(texto);
                  const id = resolverIdCiudad(texto);
                  actualizarCampo("idCiudadPostal", id);
                }}
                placeholder="Igual a la de entrega"
              />
            </div>

            <div className="campo-formulario">
              <label>Teléfono</label>
              <input
                type="text"
                value={formulario.telefono}
                onChange={(e) =>
                  actualizarCampo("telefono", e.target.value)
                }
              />
            </div>

            <div className="campo-formulario">
              <label>Código postal entrega</label>
              <input
                type="text"
                value={formulario.codigoPostalEntrega}
                onChange={(e) =>
                  actualizarCampo("codigoPostalEntrega", e.target.value)
                }
              />
            </div>

            <div className="campo-formulario">
              <label>Código postal postal</label>
              <input
                type="text"
                value={formulario.codigoPostal}
                onChange={(e) =>
                  actualizarCampo("codigoPostal", e.target.value)
                }
              />
            </div>

            <div className="campo-formulario ancho-completo">
              <label>Dirección de entrega</label>
              <input
                type="text"
                value={formulario.direccionEntregaLinea1}
                onChange={(e) =>
                  actualizarCampo("direccionEntregaLinea1", e.target.value)
                }
              />
            </div>

            <div className="campo-formulario ancho-completo">
              <label>Dirección postal</label>
              <input
                type="text"
                value={formulario.direccionPostalLinea1}
                onChange={(e) =>
                  actualizarCampo("direccionPostalLinea1", e.target.value)
                }
              />
            </div>
          </div>

          <div className="botones-formulario">
            <button
              type="button"
              className="boton-cancelar"
              onClick={cerrarModalFormulario}
              disabled={guardando}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="boton-guardar"
              disabled={guardando}
            >
              {guardando
                ? "Guardando..."
                : modoEdicion
                ? "Guardar cambios"
                : "Guardar cliente"}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL ELIMINAR */}
      <Modal
        isOpen={modalEliminarAbierto}
        onClose={cerrarModalEliminar}
      >
        {clienteEliminando && (
          <div className="confirmar-eliminar">
            <h3>¿Eliminar cliente?</h3>
            <p>
              ¿Estás seguro de eliminar a{" "}
              <span className="nombre-cliente-eliminar">
                {clienteEliminando.NombreCliente}
              </span>
              ? Esta acción no se puede deshacer.
            </p>

            <div className="botones-eliminar">
              <button
                className="boton-cancelar-eliminar"
                onClick={cerrarModalEliminar}
                disabled={eliminando}
              >
                Cancelar
              </button>

              <button
                className="boton-confirmar-eliminar"
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

export default Clientes;