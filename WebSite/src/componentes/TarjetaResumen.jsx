/**
 * Tarjeta de resumen para mostrar información estadística
 * @param {Object} props - Propiedades del componente
 * @param {string} props.titulo - Título de la tarjeta
 * @param {string|number} props.valor - Valor principal a mostrar
 * @param {string} props.descripcion - Descripción del valor
 * @returns {JSX.Element} El componente renderizado
 */
function TarjetaResumen({ titulo, valor, descripcion }) {
  return (
    <div className="tarjeta-resumen">
      <p className="tarjeta-titulo">{titulo}</p>
      <h2>{valor}</h2>
      <span>{descripcion}</span>
    </div>
  );
}

export default TarjetaResumen;
