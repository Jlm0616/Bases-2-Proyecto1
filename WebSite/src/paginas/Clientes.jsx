import { useEffect, useState } from "react";
import {
  buscarClientes,
  obtenerCategoriasCliente,
  obtenerMetodosEntrega,
} from "../servicios/clientes";
import "../estilos/clientes.css";

function Clientes() {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [metodoEntrega, setMetodoEntrega] = useState("");

  const [categorias, setCategorias] = useState([]);
  const [metodosEntrega, setMetodosEntrega] = useState([]);

  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function cargarClientes() {
    try {
      setCargando(true);
      setError("");

      const filtros = {
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

  async function cargarFiltros() {
    try {
      const categoriasObtenidas = await obtenerCategoriasCliente();
      const metodosObtenidos = await obtenerMetodosEntrega();

      setCategorias(categoriasObtenidas);
      setMetodosEntrega(metodosObtenidos);
    } catch (error) {
      setError(error.message);
    }
  }

  useEffect(() => {
    cargarClientes();
    cargarFiltros();
  }, []);

  function limpiarFiltros() {
    setNombre("");
    setCategoria("");
    setMetodoEntrega("");
  }

  return (
    <main className="contenido-clientes">
      <section className="encabezado-clientes">
        <div>
          <h2>Clientes</h2>
          <p>Administración de clientes del sistema.</p>
        </div>

        <button className="boton-principal">
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
            onChange={(evento) =>
              setNombre(evento.target.value)
            }
          />
        </div>

        <div className="grupo-filtro">
          <label>Categoría</label>

          <select
            value={categoria}
            onChange={(evento) =>
              setCategoria(evento.target.value)
            }
          >
            <option value="">Todas</option>

            {categorias.map((categoria) => (
              <option
                key={categoria.IdCategoria}
                value={categoria.IdCategoria}
              >
                {categoria.NombreCategoria}
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

            {metodosEntrega.map((metodo) => (
              <option
                key={metodo.IdMetodoEntrega}
                value={metodo.IdMetodoEntrega}
              >
                {metodo.NombreMetodoEntrega}
              </option>
            ))}
          </select>
        </div>

        <div className="grupo-filtro grupo-boton">
          <button
            className="boton-secundario"
            onClick={cargarClientes}
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
            <p>
              Clientes registrados en el sistema.
            </p>
          </div>

          <span className="cantidad-clientes">
            {clientes.length} clientes
          </span>
        </div>

        {error && (
          <div className="mensaje-error">
            {error}
          </div>
        )}

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
                      <td>
                        {cliente.NombreCliente}
                      </td>

                      <td>
                        {cliente.CategoriaCliente}
                      </td>

                      <td>
                        {cliente.MetodoEntrega}
                      </td>

                      <td>
                        <div className="acciones-clientes">
                          <button className="boton-ver">
                            Ver
                          </button>

                          <button className="boton-editar">
                            Editar
                          </button>

                          <button className="boton-eliminar">
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="sin-resultados"
                    >
                      No se encontraron clientes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default Clientes;
