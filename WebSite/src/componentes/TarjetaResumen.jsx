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
