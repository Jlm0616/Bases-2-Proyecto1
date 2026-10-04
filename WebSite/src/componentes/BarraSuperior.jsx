/**
 * Barra superior con información del panel administrativo y usuario
 * @returns {JSX.Element} El componente renderizado
 */
function BarraSuperior() {
  return (
    <header className="barra-superior">
      <div>
        <h1>Panel administrativo</h1>
        <p>WideWorldImporters</p>
      </div>

      <div className="usuario">
        <span>Administrador</span>
      </div>
    </header>
  );
}

export default BarraSuperior;
