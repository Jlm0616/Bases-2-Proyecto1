import { NavLink } from "react-router-dom";
import "../estilos/barraLateral.css";

/**
 * Barra lateral de navegación para la aplicación
 * @returns {JSX.Element} El componente renderizado
 */
function BarraLateral() {
  return (
    <aside className="barra-lateral">
      <div className="logo">
        <h2>WideWorld</h2>
        <span>Importers</span>
      </div>

      <nav className="menu">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "activo" : ""
          }
        >
          Inicio
        </NavLink>

        <NavLink
          to="/clientes"
          className={({ isActive }) => isActive ? "activo" : ""}
        >
          Clientes
        </NavLink>

        <NavLink
          to="/proveedores"
          className={({ isActive }) => isActive ? "activo" : ""}
        >
          Proveedores
        </NavLink>

        <NavLink
          to="/productos"
          className={({ isActive }) => isActive ? "activo" : ""}
        >
          Productos
        </NavLink>

        <NavLink
          to="/ventas"
          className={({ isActive }) => isActive ? "activo" : ""}
        >
          Ventas
        </NavLink>

        <NavLink
          to="/reportes"
          className={({ isActive }) => isActive ? "activo" : ""}
        >
          Reportes
        </NavLink>
      </nav>
    </aside>
  );
}

export default BarraLateral;
