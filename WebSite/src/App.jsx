import { Routes, Route } from "react-router-dom";

import BarraLateral from "./componentes/BarraLateral";
import BarraSuperior from "./componentes/BarraSuperior";

import Inicio from "./paginas/Inicio";
import Clientes from "./paginas/Clientes";
import Proveedores from "./paginas/Proveedores";
import Productos from "./paginas/Productos";
import Ventas from "./paginas/Ventas";
import Reportes from "./paginas/Reportes";

function App() {
  return (
    <div className="aplicacion">
      <BarraLateral />

      <div className="contenido-principal">
        <BarraSuperior />

        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/proveedores" element={<Proveedores />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/reportes" element={<Reportes />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
