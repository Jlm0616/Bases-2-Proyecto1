import { useEffect, useState } from "react";

import {
  obtenerAniosVentas,
  obtenerAniosCompras,
  obtenerCategoriasProducto,
  obtenerSubcategoriasProducto,
  obtenerProveedores,
  obtenerProductos,
  obtenerCategoriasCliente,
} from "../servicios/filtros";

import {
  obtenerMontosProveedores,
  obtenerMontosClientes,
  obtenerTopProductos,
  obtenerTopClientes,
  obtenerTopProveedores,
  obtenerMatrizVentas,
  obtenerSeguimientoClientes,
  obtenerSeguimientoProveedores,
  obtenerRotacionInventario,
  obtenerMetodoEnvioFavorito,
} from "../servicios/reportes";

import "../estilos/reportes.css";

/**
 * Consulta de reportes estadísticos del sistema
 * @returns {JSX.Element} La página renderizada
 */
function Reportes() {
  const [reporteSeleccionado, setReporteSeleccionado] = useState("");

  const [aniosVentas, setAniosVentas] = useState([]);
  const [aniosCompras, setAniosCompras] = useState([]);
  const [categoriasProducto, setCategoriasProducto] = useState([]);
  const [subcategoriasProducto, setSubcategoriasProducto] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categoriasCliente, setCategoriasCliente] = useState([]);

  const [nombreProveedor, setNombreProveedor] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [categoria, setCategoria] = useState("");

  const [anio, setAnio] = useState("");
  const [anioInicio, setAnioInicio] = useState("");
  const [anioFin, setAnioFin] = useState("");
  const [mes, setMes] = useState("");

  const [categoriaProducto, setCategoriaProducto] = useState("");
  const [subcategoriaProducto, setSubcategoriaProducto] = useState("");
  const [categoriaCliente, setCategoriaCliente] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [producto, setProducto] = useState("");

  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const [paginaActual, setPaginaActual] = useState(1);
  const [tamanoPagina, setTamanoPagina] = useState(25);

  const meses = [
    { id: 1, nombre: "Enero" },
    { id: 2, nombre: "Febrero" },
    { id: 3, nombre: "Marzo" },
    { id: 4, nombre: "Abril" },
    { id: 5, nombre: "Mayo" },
    { id: 6, nombre: "Junio" },
    { id: 7, nombre: "Julio" },
    { id: 8, nombre: "Agosto" },
    { id: 9, nombre: "Septiembre" },
    { id: 10, nombre: "Octubre" },
    { id: 11, nombre: "Noviembre" },
    { id: 12, nombre: "Diciembre" },
  ];

  const reportes = [
    {
      id: "1",
      nombre: "Montos de proveedores",
    },
    {
      id: "2",
      nombre: "Montos de clientes",
    },
    {
      id: "3",
      nombre: "Top 5 productos por ganancia",
    },
    {
      id: "4",
      nombre: "Top 5 clientes por facturas",
    },
    {
      id: "5",
      nombre: "Top 5 proveedores por órdenes",
    },
    {
      id: "6",
      nombre: "Matriz de ventas por categoría",
    },
    {
      id: "7",
      nombre: "Seguimiento de compras de clientes",
    },
    {
      id: "8",
      nombre: "Seguimiento de compras de proveedores",
    },
    {
      id: "9",
      nombre: "Rotación de inventario",
    },
    {
      id: "10",
      nombre: "Método de envío favorito",
    },
  ];

  async function cargarAuxiliares() {
    try {
      const [
        datosAniosVentas,
        datosAniosCompras,
        datosCategoriasProducto,
        datosSubcategoriasProducto,
        datosProveedores,
        datosProductos,
        datosCategoriasCliente,
      ] = await Promise.all([
        obtenerAniosVentas(),
        obtenerAniosCompras(),
        obtenerCategoriasProducto(),
        obtenerSubcategoriasProducto(),
        obtenerProveedores(),
        obtenerProductos(),
        obtenerCategoriasCliente(),
      ]);

      setAniosVentas(datosAniosVentas);
      setAniosCompras(datosAniosCompras);
      setCategoriasProducto(datosCategoriasProducto);
      setSubcategoriasProducto(datosSubcategoriasProducto);
      setProveedores(datosProveedores);
      setProductos(datosProductos);
      setCategoriasCliente(datosCategoriasCliente);
    } catch (error) {
      setError(error.message);
    }
  }

  useEffect(() => {
    cargarAuxiliares();
  }, []);

  function limpiarFiltros() {
    setNombreProveedor("");
    setNombreCliente("");
    setCategoria("");

    setAnio("");
    setAnioInicio("");
    setAnioFin("");
    setMes("");

    setCategoriaProducto("");
    setSubcategoriaProducto("");
    setCategoriaCliente("");
    setProveedor("");
    setProducto("");

    setResultados([]);
    setError("");
    setPaginaActual(1);
  }

  function cambiarReporte(evento) {
    setReporteSeleccionado(evento.target.value);
    limpiarFiltros();
  }

  async function consultarReporte() {
    if (!reporteSeleccionado) {
      setError("Seleccione un reporte.");
      return;
    }

    try {
      setCargando(true);
      setError("");
      setResultados([]);

      let datos;

      switch (reporteSeleccionado) {
        case "1":
          datos = await obtenerMontosProveedores({
            nombreProveedor,
            categoria,
          });
          break;

        case "2":
          datos = await obtenerMontosClientes({
            nombreCliente,
            categoria,
          });
          break;

        case "3":
          datos = await obtenerTopProductos({
            anio: anio === "" ? null : Number(anio),
          });
          break;

        case "4":
          datos = await obtenerTopClientes({
            anioInicio:
              anioInicio === "" ? null : Number(anioInicio),

            anioFin:
              anioFin === "" ? null : Number(anioFin),
          });
          break;

        case "5":
          datos = await obtenerTopProveedores({
            anioInicio:
              anioInicio === "" ? null : Number(anioInicio),

            anioFin:
              anioFin === "" ? null : Number(anioFin),
          });
          break;

        case "6":
          datos = await obtenerMatrizVentas();
          break;

        case "7":
          datos = await obtenerSeguimientoClientes({
            anio: anio === "" ? null : Number(anio),
            mes: mes === "" ? null : Number(mes),
            categoria: categoriaProducto || null,
            subcategoria: subcategoriaProducto || null,
          });
          break;

        case "8":
          datos = await obtenerSeguimientoProveedores({
            anio: anio === "" ? null : Number(anio),
            mes: mes === "" ? null : Number(mes),
            categoria: categoriaProducto || null,
            subcategoria: subcategoriaProducto || null,
          });
          break;

        case "9":
          datos = await obtenerRotacionInventario({
            categoria: categoriaProducto || null,
            anio: anio === "" ? null : Number(anio),
            proveedor: proveedor || null,
          });
          break;

        case "10":
          datos = await obtenerMetodoEnvioFavorito({
            anio: anio === "" ? null : Number(anio),
            mes: mes === "" ? null : Number(mes),
            categoriaCliente: categoriaCliente || null,
            categoriaProducto: categoriaProducto || null,
            producto: producto || null,
          });
          break;

        default:
          return;
      }

      setResultados(Array.isArray(datos) ? datos : []);
      setPaginaActual(1);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }

  function mostrarAnioVentas() {
    return ["3", "7", "9", "10"].includes(reporteSeleccionado);
  }

  function mostrarAnioCompras() {
    return reporteSeleccionado === "8";
  }

  function mostrarRangoAniosVentas() {
    return reporteSeleccionado === "4";
  }

  function mostrarRangoAniosCompras() {
    return reporteSeleccionado === "5";
  }

  function mostrarMes() {
    return ["7", "8", "10"].includes(reporteSeleccionado);
  }

  function mostrarCategoriaProducto() {
    return ["7", "8", "9", "10"].includes(reporteSeleccionado);
  }

  const columnas =
    resultados.length > 0
      ? Object.keys(resultados[0])
      : [];

  const totalRegistros = resultados.length;

  const totalPaginas = Math.ceil(
    totalRegistros / tamanoPagina
  );

  const indiceInicial =
    (paginaActual - 1) * tamanoPagina;

  const indiceFinal =
    indiceInicial + tamanoPagina;

  const resultadosPaginados = resultados.slice(
    indiceInicial,
    indiceFinal
  );

  function irPagina(nuevaPagina) {
    if (
      nuevaPagina < 1 ||
      nuevaPagina > totalPaginas
    ) {
      return;
    }

    setPaginaActual(nuevaPagina);
  }

  function cambiarTamanoPagina(nuevoTamano) {
    setTamanoPagina(nuevoTamano);
    setPaginaActual(1);
  }

  function generarPaginas() {
    const paginas = [];
    const maxBotones = 5;

    let inicio = Math.max(
      1,
      paginaActual - 2
    );

    let fin = Math.min(
      totalPaginas,
      inicio + maxBotones - 1
    );

    if (fin - inicio + 1 < maxBotones) {
      inicio = Math.max(
        1,
        fin - maxBotones + 1
      );
    }

    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }

    return paginas;
  }

  return (
    <main className="contenido-reportes">
      <section className="encabezado-reportes">
        <div>
          <h2>Reportes</h2>

          <p>
            Consulte información estadística de WideWorldImporters.
          </p>
        </div>
      </section>

      <section className="selector-reporte">
        <div className="grupo-reporte reporte-principal">
          <label>Reporte</label>

          <select
            value={reporteSeleccionado}
            onChange={cambiarReporte}
          >
            <option value="">
              Seleccione un reporte
            </option>

            {reportes.map((reporte) => (
              <option
                key={reporte.id}
                value={reporte.id}
              >
                {reporte.id}. {reporte.nombre}
              </option>
            ))}
          </select>
        </div>
      </section>

      {reporteSeleccionado && (
        <section className="filtros-reportes">
          {reporteSeleccionado === "1" && (
            <>
              <div className="grupo-reporte">
                <label>Proveedor</label>

                <input
                  type="text"
                  value={nombreProveedor}
                  onChange={(evento) =>
                    setNombreProveedor(evento.target.value)
                  }
                  placeholder="Nombre del proveedor"
                />
              </div>

              <div className="grupo-reporte">
                <label>Categoría</label>

                <input
                  type="text"
                  value={categoria}
                  onChange={(evento) =>
                    setCategoria(evento.target.value)
                  }
                  placeholder="Categoría"
                />
              </div>
            </>
          )}

          {reporteSeleccionado === "2" && (
            <>
              <div className="grupo-reporte">
                <label>Cliente</label>

                <input
                  type="text"
                  value={nombreCliente}
                  onChange={(evento) =>
                    setNombreCliente(evento.target.value)
                  }
                  placeholder="Nombre del cliente"
                />
              </div>

              <div className="grupo-reporte">
                <label>Categoría</label>

                <input
                  type="text"
                  value={categoria}
                  onChange={(evento) =>
                    setCategoria(evento.target.value)
                  }
                  placeholder="Categoría"
                />
              </div>
            </>
          )}

          {mostrarAnioVentas() && (
            <div className="grupo-reporte">
              <label>Año</label>

              <select
                value={anio}
                onChange={(evento) =>
                  setAnio(evento.target.value)
                }
              >
                <option value="">Todos</option>

                {aniosVentas.map((elemento) => (
                  <option
                    key={elemento.Anio}
                    value={elemento.Anio}
                  >
                    {elemento.Anio}
                  </option>
                ))}
              </select>
            </div>
          )}

          {mostrarAnioCompras() && (
            <div className="grupo-reporte">
              <label>Año</label>

              <select
                value={anio}
                onChange={(evento) =>
                  setAnio(evento.target.value)
                }
              >
                <option value="">Todos</option>

                {aniosCompras.map((elemento) => (
                  <option
                    key={elemento.Anio}
                    value={elemento.Anio}
                  >
                    {elemento.Anio}
                  </option>
                ))}
              </select>
            </div>
          )}

          {mostrarRangoAniosVentas() && (
            <>
              <SelectorRangoAnios
                titulo="Año inicial"
                valor={anioInicio}
                cambiarValor={setAnioInicio}
                anios={aniosVentas}
              />

              <SelectorRangoAnios
                titulo="Año final"
                valor={anioFin}
                cambiarValor={setAnioFin}
                anios={aniosVentas}
              />
            </>
          )}

          {mostrarRangoAniosCompras() && (
            <>
              <SelectorRangoAnios
                titulo="Año inicial"
                valor={anioInicio}
                cambiarValor={setAnioInicio}
                anios={aniosCompras}
              />

              <SelectorRangoAnios
                titulo="Año final"
                valor={anioFin}
                cambiarValor={setAnioFin}
                anios={aniosCompras}
              />
            </>
          )}

          {mostrarMes() && (
            <div className="grupo-reporte">
              <label>Mes</label>

              <select
                value={mes}
                onChange={(evento) =>
                  setMes(evento.target.value)
                }
              >
                <option value="">Todos</option>

                {meses.map((elemento) => (
                  <option
                    key={elemento.id}
                    value={elemento.id}
                  >
                    {elemento.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}

          {mostrarCategoriaProducto() && (
            <div className="grupo-reporte">
              <label>Categoría de producto</label>

              <select
                value={categoriaProducto}
                onChange={(evento) =>
                  setCategoriaProducto(evento.target.value)
                }
              >
                <option value="">Todas</option>

                {categoriasProducto.map((elemento) => (
                  <option
                    key={elemento.IdCategoriaProducto}
                    value={elemento.NombreCategoriaProducto}
                  >
                    {elemento.NombreCategoriaProducto}
                  </option>
                ))}
              </select>
            </div>
          )}

          {["7", "8"].includes(reporteSeleccionado) && (
            <div className="grupo-reporte">
              <label>Subcategoría de producto</label>

              <select
                value={subcategoriaProducto}
                onChange={(evento) =>
                  setSubcategoriaProducto(evento.target.value)
                }
              >
                <option value="">Todas</option>

                {subcategoriasProducto.map((elemento) => (
                  <option
                    key={elemento.IdSubcategoria}
                    value={elemento.NombreSubcategoria}
                  >
                    {elemento.NombreSubcategoria}
                  </option>
                ))}
              </select>
            </div>
          )}

          {reporteSeleccionado === "9" && (
            <div className="grupo-reporte">
              <label>Proveedor</label>

              <select
                value={proveedor}
                onChange={(evento) =>
                  setProveedor(evento.target.value)
                }
              >
                <option value="">Todos</option>

                {proveedores.map((elemento) => (
                  <option
                    key={elemento.IdProveedor}
                    value={elemento.NombreProveedor}
                  >
                    {elemento.NombreProveedor}
                  </option>
                ))}
              </select>
            </div>
          )}

          {reporteSeleccionado === "10" && (
            <>
              <div className="grupo-reporte">
                <label>Categoría de cliente</label>

                <select
                  value={categoriaCliente}
                  onChange={(evento) =>
                    setCategoriaCliente(evento.target.value)
                  }
                >
                  <option value="">Todas</option>

                  {categoriasCliente.map((elemento) => (
                    <option
                      key={elemento.IdCategoria}
                      value={elemento.NombreCategoria}
                    >
                      {elemento.NombreCategoria}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grupo-reporte">
                <label>Producto</label>

                <select
                  value={producto}
                  onChange={(evento) =>
                    setProducto(evento.target.value)
                }
                >
                  <option value="">Todos</option>

                  {productos.map((elemento) => (
                    <option
                      key={elemento.IdProducto}
                      value={elemento.NombreProducto}
                    >
                      {elemento.NombreProducto}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="acciones-reportes">
            <button
              className="boton-consultar-reporte"
              onClick={consultarReporte}
            >
              Consultar
            </button>

            <button
              className="boton-limpiar-reporte"
              onClick={limpiarFiltros}
            >
              Limpiar
            </button>
          </div>
        </section>
      )}

      {error && (
        <div className="mensaje-error-reporte">
          {error}
        </div>
      )}

      {cargando && (
        <div className="mensaje-cargando-reporte">
          Consultando reporte...
        </div>
      )}

      {!cargando && resultados.length > 0 && (
        <section className="resultados-reportes">
          <div className="encabezado-resultados">
            <div>
              <h3>Resultados</h3>
              <p>
                {resultados.length} registros encontrados
              </p>
            </div>
          </div>

          <div className="contenedor-tabla-reportes">
            <table className="tabla-reportes">
              <thead>
                <tr>
                  {columnas.map((columna) => (
                    <th key={columna}>
                      {columna}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {resultadosPaginados.map((fila, indice) => (
                  <tr key={indice}>
                    {columnas.map((columna) => (
                      <td key={columna}>
                        {fila[columna] === null ||
                        fila[columna] === undefined
                          ? ""
                          : String(fila[columna])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPaginas > 1 && (
            <div className="paginacion-reportes">

              <div className="paginacion-info-reportes">
                Mostrando{" "}
                {indiceInicial + 1} a{" "}
                {Math.min(
                  indiceFinal,
                  totalRegistros
                )}{" "}
                de {totalRegistros}
              </div>

              <div className="paginacion-controles-reportes">

                <button
                  className="boton-pagina-reportes"
                  onClick={() => irPagina(1)}
                  disabled={paginaActual === 1}
                >
                  «
                </button>

                <button
                  className="boton-pagina-reportes"
                  onClick={() =>
                    irPagina(paginaActual - 1)
                  }
                  disabled={paginaActual === 1}
                >
                  ‹ Anterior
                </button>

                {generarPaginas().map((numero) => (
                  <button
                    key={numero}
                    className={`boton-pagina-reportes ${
                      numero === paginaActual
                        ? "pagina-activa-reportes"
                        : ""
                    }`}
                    onClick={() =>
                      irPagina(numero)
                    }
                  >
                    {numero}
                  </button>
                ))}

                <button
                  className="boton-pagina-reportes"
                  onClick={() =>
                    irPagina(paginaActual + 1)
                  }
                  disabled={
                    paginaActual === totalPaginas
                  }
                >
                  Siguiente ›
                </button>

                <button
                  className="boton-pagina-reportes"
                  onClick={() =>
                    irPagina(totalPaginas)
                  }
                  disabled={
                    paginaActual === totalPaginas
                  }
                >
                  »
                </button>

              </div>

              <div className="paginacion-tamano-reportes">
                <label>Por página:</label>

                <select
                  value={tamanoPagina}
                  onChange={(evento) =>
                    cambiarTamanoPagina(
                      Number(evento.target.value)
                    )
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
        </section>
      )}

      {!cargando &&
        reporteSeleccionado &&
        resultados.length === 0 &&
        !error && (
          <div className="sin-resultados-reporte">
            Seleccione los filtros y presione Consultar.
          </div>
        )}
    </main>
  );
}

function SelectorRangoAnios({
  titulo,
  valor,
  cambiarValor,
  anios,
}) {
  return (
    <div className="grupo-reporte">
      <label>{titulo}</label>

      <select
        value={valor}
        onChange={(evento) =>
          cambiarValor(evento.target.value)
        }
      >
        <option value="">Todos</option>

        {anios.map((elemento) => (
          <option
            key={elemento.Anio}
            value={elemento.Anio}
          >
            {elemento.Anio}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Reportes;
