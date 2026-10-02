import React, { useState } from 'react';
import BarraLateral from './componentes/BarraLateral';
import BarraSuperior from './componentes/BarraSuperior';
import Inicio from './paginas/Inicio';
import Clientes from './paginas/Clientes';
import Proveedores from './paginas/Proveedores';
import Productos from './paginas/Productos';
import Ventas from './paginas/Ventas';
import Reportes from './paginas/Reportes';
import './estilos/global.css';
import './estilos/barraLateral.css';
import './estilos/dashboard.css';

function App() {
  const [paginaActual, setPaginaActual] = useState('inicio');

  const renderPagina = () => {
    switch (paginaActual) {
      case 'inicio':
        return <Inicio />;
      case 'clientes':
        return <Clientes />;
      case 'proveedores':
        return <Proveedores />;
      case 'productos':
        return <Productos />;
      case 'ventas':
        return <Ventas />;
      case 'reportes':
        return <Reportes />;
      default:
        return <Inicio />;
    }
  };

  return (
    <div className="app">
      <BarraLateral onNavegar={setPaginaActual} paginaActual={paginaActual} />
      <div className="contenido-principal">
        <BarraSuperior />
        <main className="dashboard">
          {renderPagina()}
        </main>
      </div>
    </div>
  );
}

export default App;
