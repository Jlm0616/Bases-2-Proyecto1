import { useEffect, useState } from "react";
import {
  buscarProveedores,
  obtenerCategoriasProveedor,
  obtenerMetodosEntrega,
  obtenerDetalleProveedor,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor,
  obtenerPersonas,
  obtenerCiudades,
} from "../servicios/proveedores";
import Modal from "../componentes/Modal";
import "../estilos/proveedores.css";

const FORMULARIO_VACIO = {
  nombreProveedor: "",
  idCategoria: "",
  idMetodoEntrega: "",
  idContactoPrimario: "",
  idContactoAlternativo: "",
  idCiudadEntrega: "",
  idCiudadPostal: "",
  telefono: "",
  direccionEntregaLinea1: "",
  codigoPostalEntrega: "",
  direccionPostalLinea1: "",
  codigoPostal: "",
  idEditadoPor: "1361",
};

function Proveedores() {
  // Filtros
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");

  // Catálogos
  const [categorias, setCategorias] = useState([]);
  const [metodosEntrega, setMetodosEntrega] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [ciudades, setCiudades] = useState([]);

  // Búsquedas de datalist
  const [busquedaContacto, setBusquedaContacto] = useState("");
  const [busquedaContactoAlt, setBusquedaContactoAlt] = useState("");
  const [busquedaCiudadEntrega, setBusquedaCiudadEntrega] = useState("");
  const [busquedaCiudadPostal, setBusquedaCiudadPostal] = useState("");

  // Tabla
  const [proveedores, setProveedores] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  // Modal detalle
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [detalleProveedor, setDetalleProveedor] = useState(null);
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
  const [proveedorEliminando, setProveedorEliminando] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  async function cargarProveedores(filtrosOverride) {
    try {
      setCargando(true);
      setError("");

      const filtros = filtrosOverride || {
        nombre: nombre,
        idCategoria: categoria === "" ? null : Number(categoria),
      };

      const datos = await buscarProveedores(filtros);
      setProveedores(datos);
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
      ] = await Promise.all([
        obtenerCategoriasProveedor(),
        obtenerMetodosEntrega(),
        obtenerPersonas(),
        obtenerCiudades(),
      ]);

      setCategorias(categoriasObtenidas);
      setMetodosEntrega(metodosObtenidos);
      setPersonas(personasObtenidas);
      setCiudades(ciudadesObtenidas);
    } catch (error) {
      setError(error.message);
    }
  }

  // Carga inicial
  useEffect(() => {
    cargarProveedores({ nombre: "", idCategoria: null });
    cargarCatalogos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // DEBOUNCE
  useEffect(() => {
    const timer = setTimeout(() => {
      cargarProveedores({
        nombre: nombre,
        idCategoria: categoria === "" ? null : Number(categoria),
      });
    }, 400);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nombre, categoria]);

  async function limpiarFiltros() {
    setNombre("");
    setCategoria("");
  }

  // Helpers
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

  async function verProveedor(idProveedor) {
    setModalDetalleAbierto(true);
    setCargandoDetalle(true);
    setDetalleProveedor(null);

    try {
      const detalle = await obtenerDetalleProveedor(idProveedor);
      setDetalleProveedor(detalle);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargandoDetalle(false);
    }
  }

  function cerrarModalDetalle() {
    setModalDetalleAbierto(false);
    setDetalleProveedor(null);
  }

  function abrirModalCrear() {
    setFormulario(FORMULARIO_VACIO);
    setBusquedaContacto("");
    setBusquedaContactoAlt("");
    setBusquedaCiudadEntrega("");
    setBusquedaCiudadPostal("");
    setModoEdicion(false);
    setIdEditando(null);
    setErrorFormulario("");
    setModalFormularioAbierto(true);
  }

  async function abrirModalEditar(proveedor) {
    try {
      const detalle = await obtenerDetalleProveedor(proveedor.IdProveedor);

      setFormulario({
        nombreProveedor: detalle.NombreProveedor || "",
        idCategoria: detalle.IdCategoria?.toString() || "",
        idMetodoEntrega: detalle.IdMetodoEntrega?.toString() || "",
        idContactoPrimario: detalle.IdContactoPrimario?.toString() || "",
        idContactoAlternativo:
          detalle.IdContactoAlternativo?.toString() || "",
        idCiudadEntrega: detalle.IdCiudadEntrega?.toString() || "",
        idCiudadPostal: "",
        telefono: detalle.Telefono || "",
        direccionEntregaLinea1: detalle.DireccionEntregaLinea1 || "",
        codigoPostalEntrega: detalle.CodigoPostalEntrega || "",
        direccionPostalLinea1: detalle.DireccionPostalLinea1 || "",
        codigoPostal: detalle.CodigoPostalPostal || "",
        idEditadoPor: "1361",
      });

      setBusquedaContacto(nombreDePersona(detalle.IdContactoPrimario));
      setBusquedaContactoAlt(
        nombreDePersona(detalle.IdContactoAlternativo)
      );
      setBusquedaCiudadEntrega(nombreDeCiudad(detalle.IdCiudadEntrega));
      setBusquedaCiudadPostal("");

      setModoEdicion(true);
      setIdEditando(proveedor.IdProveedor);
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
    setBusquedaContactoAlt("");
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

  async function guardarProveedor(evento) {
    evento.preventDefault();
    setErrorFormulario("");

    if (!formulario.nombreProveedor.trim()) {
      setErrorFormulario("El nombre del proveedor es obligatorio.");
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
      if (!formulario.idContactoAlternativo) {
        setErrorFormulario(
          "Debe seleccionar un contacto alternativo válido."
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
        nombreProveedor: formulario.nombreProveedor.trim(),
        idCategoria: formulario.idCategoria
          ? Number(formulario.idCategoria)
          : null,
        idMetodoEntrega: formulario.idMetodoEntrega
          ? Number(formulario.idMetodoEntrega)
          : null,
        idContactoPrimario: formulario.idContactoPrimario
          ? Number(formulario.idContactoPrimario)
          : null,
        idContactoAlternativo: formulario.idContactoAlternativo
          ? Number(formulario.idContactoAlternativo)
          : null,
        idCiudadEntrega: formulario.idCiudadEntrega
          ? Number(formulario.idCiudadEntrega)
          : null,
        idEditadoPor: Number(formulario.idEditadoPor),
        idCiudadPostal: formulario.idCiudadPostal
          ? Number(formulario.idCiudadPostal)
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
        await actualizarProveedor(idEditando, payload);
      } else {
        await crearProveedor(payload);
      }

      cerrarModalFormulario();
      await cargarProveedores();
    } catch (error) {
      setErrorFormulario(error.message);
    } finally {
      setGuardando(false);
    }
  }

  function abrirModalEliminar(proveedor) {
    setProveedorEliminando(proveedor);
    setModalEliminarAbierto(true);
  }

  function cerrarModalEliminar() {
    setModalEliminarAbierto(false);
    setProveedorEliminando(null);
  }

  async function confirmarEliminar() {
    if (!proveedorEliminando) return;

    try {
      setEliminando(true);
      await eliminarProveedor(proveedorEliminando.IdProveedor);
      cerrarModalEliminar();
      await cargarProveedores();
    } catch (error) {
      setError(error.message);
      cerrarModalEliminar();
    } finally {
      setEliminando(false);
    }
  }

  return (
    <main className="contenido-proveedores">
      <section className="encabezado-proveedores">
        <div>
          <h2>Proveedores</h2>
          <p>Administración de proveedores del sistema.</p>
        </div>

        <button
          className="boton-principal-prov"
          onClick={abrirModalCrear}
        >
          Agregar proveedor
        </button>
      </section>

      <section className="seccion-filtros-prov">
        <div className="grupo-filtro-prov">
          <label>Nombre</label>
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={nombre}
            onChange={(evento) => setNombre(evento.target.value)}
          />
        </div>

        <div className="grupo-filtro-prov">
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

        <div className="grupo-filtro-prov grupo-boton-prov">
          <button
            className="boton-secundario-prov"
            onClick={() => cargarProveedores()}
          >
            Buscar
          </button>
        </div>

        <div className="grupo-filtro-prov grupo-boton-prov">
          <button
            className="boton-secundario-prov"
            onClick={limpiarFiltros}
          >
            Limpiar filtros
          </button>
        </div>
      </section>

      <section className="seccion-tabla-prov">
        <div className="titulo-tabla-prov">
          <div>
            <h3>Listado de proveedores</h3>
            <p>Proveedores registrados en el sistema.</p>
          </div>

          <span className="cantidad-prov">
            {proveedores.length} proveedores
          </span>
        </div>

        {error && <div className="mensaje-error-prov">{error}</div>}

        {cargando ? (
          <div className="mensaje-cargando-prov">
            Cargando proveedores...
          </div>
        ) : (
          <div className="contenedor-tabla-prov">
            <table className="tabla-prov">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Método de entrega</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {proveedores.length > 0 ? (
                  proveedores.map((proveedor) => (
                    <tr key={proveedor.IdProveedor}>
                      <td>{proveedor.NombreProveedor}</td>
                      <td>{proveedor.CategoriaProveedor}</td>
                      <td>{proveedor.MetodoEntrega || "—"}</td>
                      <td>
                        <div className="acciones-prov">
                          <button
                            className="boton-ver-prov"
                            onClick={() =>
                              verProveedor(proveedor.IdProveedor)
                            }
                          >
                            Ver
                          </button>

                          <button
                            className="boton-editar-prov"
                            onClick={() =>
                              abrirModalEditar(proveedor)
                            }
                          >
                            Editar
                          </button>

                          <button
                            className="boton-eliminar-prov"
                            onClick={() =>
                              abrirModalEliminar(proveedor)
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
                    <td colSpan="4" className="sin-resultados-prov">
                      No se encontraron proveedores.
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
        ) : detalleProveedor ? (
          <div className="detalle-prov">
            <h3>{detalleProveedor.NombreProveedor}</h3>
            <p className="subtitulo-prov">
              Proveedor #{detalleProveedor.IdProveedor} · Código{" "}
              {detalleProveedor.CodigoProveedor}
            </p>

            <div className="grid-detalle-prov">
              <div className="campo-prov">
                <span className="campo-etiqueta-prov">Categoría</span>
                <span className="campo-valor-prov">
                  {detalleProveedor.CategoriaProveedor || "—"}
                </span>
              </div>

              <div className="campo-prov">
                <span className="campo-etiqueta-prov">Contacto primario</span>
                <span className="campo-valor-prov">
                  {detalleProveedor.ContactoPrimario || "—"}
                </span>
              </div>

              <div className="campo-prov">
                <span className="campo-etiqueta-prov">
                  Contacto alternativo
                </span>
                <span className="campo-valor-prov">
                  {detalleProveedor.ContactoAlternativo || "—"}
                </span>
              </div>

              <div className="campo-prov">
                <span className="campo-etiqueta-prov">
                  Método de entrega
                </span>
                <span className="campo-valor-prov">
                  {detalleProveedor.MetodoEntrega || "—"}
                </span>
              </div>

              <div className="campo-prov">
                <span className="campo-etiqueta-prov">
                  Ciudad de entrega
                </span>
                <span className="campo-valor-prov">
                  {detalleProveedor.CiudadEntrega || "—"}
                </span>
              </div>

              <div className="campo-prov">
                <span className="campo-etiqueta-prov">Código postal</span>
                <span className="campo-valor-prov">
                  {detalleProveedor.CodigoPostalEntrega || "—"}
                </span>
              </div>

              <div className="campo-prov">
                <span className="campo-etiqueta-prov">Teléfono</span>
                <span className="campo-valor-prov">
                  {detalleProveedor.Telefono || "—"}
                </span>
              </div>

              <div className="campo-prov">
                <span className="campo-etiqueta-prov">Fax</span>
                <span className="campo-valor-prov">
                  {detalleProveedor.Fax || "—"}
                </span>
              </div>

              <div className="campo-prov">
                <span className="campo-etiqueta-prov">Sitio web</span>
                <span className="campo-valor-prov">
                  {detalleProveedor.SitioWeb ? (
                    <a
                      href={detalleProveedor.SitioWeb}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {detalleProveedor.SitioWeb}
                    </a>
                  ) : (
                    "—"
                  )}
                </span>
              </div>

              <div className="campo-prov">
                <span className="campo-etiqueta-prov">Días de gracia</span>
                <span className="campo-valor-prov">
                  {detalleProveedor.DiasGraciaPago ?? "—"}
                </span>
              </div>

              <div className="campo-prov">
                <span className="campo-etiqueta-prov">Nombre del banco</span>
                <span className="campo-valor-prov">
                  {detalleProveedor.NombreBanco || "—"}
                </span>
              </div>

              <div className="campo-prov">
                <span className="campo-etiqueta-prov">
                  Cuenta corriente
                </span>
                <span className="campo-valor-prov">
                  {detalleProveedor.NumeroCuentaCorriente || "—"}
                </span>
              </div>

              <div className="campo-prov campo-ancho-prov">
                <span className="campo-etiqueta-prov">
                  Dirección de entrega
                </span>
                <span className="campo-valor-prov">
                  {detalleProveedor.DireccionEntregaLinea1 || "—"}
                  {detalleProveedor.DireccionEntregaLinea2 &&
                    `, ${detalleProveedor.DireccionEntregaLinea2}`}
                </span>
              </div>

              <div className="campo-prov campo-ancho-prov">
                <span className="campo-etiqueta-prov">
                  Dirección postal
                </span>
                <span className="campo-valor-prov">
                  {detalleProveedor.DireccionPostalLinea1 || "—"}
                  {detalleProveedor.DireccionPostalLinea2 &&
                    `, ${detalleProveedor.DireccionPostalLinea2}`}
                </span>
              </div>

              <div className="campo-prov campo-ancho-prov">
                <span className="campo-etiqueta-prov">
                  Ubicación en el mapa
                </span>
                <span className="campo-valor-prov">
                  {detalleProveedor.UbicacionEntregaMapa || "—"}
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
          className="formulario-prov"
          onSubmit={guardarProveedor}
        >
          <h3>{modoEdicion ? "Editar proveedor" : "Nuevo proveedor"}</h3>

          {errorFormulario && (
            <div className="mensaje-error-prov">{errorFormulario}</div>
          )}

          <div className="formulario-grid-prov">
            <div className="campo-formulario-prov ancho-completo-prov">
              <label>Nombre del proveedor *</label>
              <input
                type="text"
                value={formulario.nombreProveedor}
                onChange={(e) =>
                  actualizarCampo("nombreProveedor", e.target.value)
                }
                required
              />
            </div>

            <div className="campo-formulario-prov">
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

            <div className="campo-formulario-prov">
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

            {/* Contacto primario con datalist */}
            <div className="campo-formulario-prov">
              <label>Contacto primario {!modoEdicion && "*"}</label>
              <input
                type="text"
                list="lista-personas-prov"
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
              <datalist id="lista-personas-prov">
                {personas.slice(0, 200).map((p) => (
                  <option key={p.IdPersona} value={p.NombrePersona} />
                ))}
              </datalist>
            </div>

            {/* Contacto alternativo con datalist */}
            <div className="campo-formulario-prov">
              <label>Contacto alternativo {!modoEdicion && "*"}</label>
              <input
                type="text"
                list="lista-personas-prov"
                value={busquedaContactoAlt}
                onChange={(e) => {
                  const texto = e.target.value;
                  setBusquedaContactoAlt(texto);
                  const id = resolverIdPersona(texto);
                  actualizarCampo("idContactoAlternativo", id);
                }}
                placeholder="Escriba para buscar..."
                required={!modoEdicion}
              />
            </div>

            {/* Ciudad de entrega con datalist */}
            <div className="campo-formulario-prov">
              <label>Ciudad de entrega {!modoEdicion && "*"}</label>
              <input
                type="text"
                list="lista-ciudades-prov"
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
              <datalist id="lista-ciudades-prov">
                {ciudades.slice(0, 500).map((c) => (
                  <option key={c.IdCiudad} value={c.NombreCiudad} />
                ))}
              </datalist>
            </div>

            {/* Ciudad postal con datalist */}
            <div className="campo-formulario-prov">
              <label>Ciudad postal</label>
              <input
                type="text"
                list="lista-ciudades-prov"
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

            <div className="campo-formulario-prov">
              <label>Teléfono</label>
              <input
                type="text"
                value={formulario.telefono}
                onChange={(e) =>
                  actualizarCampo("telefono", e.target.value)
                }
              />
            </div>

            <div className="campo-formulario-prov">
              <label>Código postal entrega</label>
              <input
                type="text"
                value={formulario.codigoPostalEntrega}
                onChange={(e) =>
                  actualizarCampo("codigoPostalEntrega", e.target.value)
                }
              />
            </div>

            <div className="campo-formulario-prov">
              <label>Código postal postal</label>
              <input
                type="text"
                value={formulario.codigoPostal}
                onChange={(e) =>
                  actualizarCampo("codigoPostal", e.target.value)
                }
              />
            </div>

            <div className="campo-formulario-prov ancho-completo-prov">
              <label>Dirección de entrega</label>
              <input
                type="text"
                value={formulario.direccionEntregaLinea1}
                onChange={(e) =>
                  actualizarCampo("direccionEntregaLinea1", e.target.value)
                }
              />
            </div>

            <div className="campo-formulario-prov ancho-completo-prov">
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

          <div className="botones-formulario-prov">
            <button
              type="button"
              className="boton-cancelar-prov"
              onClick={cerrarModalFormulario}
              disabled={guardando}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="boton-guardar-prov"
              disabled={guardando}
            >
              {guardando
                ? "Guardando..."
                : modoEdicion
                ? "Guardar cambios"
                : "Guardar proveedor"}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL ELIMINAR */}
      <Modal
        isOpen={modalEliminarAbierto}
        onClose={cerrarModalEliminar}
      >
        {proveedorEliminando && (
          <div className="confirmar-eliminar-prov">
            <h3>¿Eliminar proveedor?</h3>
            <p>
              ¿Estás seguro de eliminar a{" "}
              <span className="nombre-eliminar-prov">
                {proveedorEliminando.NombreProveedor}
              </span>
              ? Esta acción no se puede deshacer.
            </p>

            <div className="botones-eliminar-prov">
              <button
                className="boton-cancelar-eliminar-prov"
                onClick={cerrarModalEliminar}
                disabled={eliminando}
              >
                Cancelar
              </button>

              <button
                className="boton-confirmar-eliminar-prov"
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

export default Proveedores;