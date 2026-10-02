import React from 'react';

const TarjetaResumen = ({ titulo, valor, icono }) => {
  return (
    <div className="tarjeta-resumen">
      <div className="tarjeta-icono">{icono}</div>
      <div className="tarjeta-contenido">
        <h3>{titulo}</h3>
        <p>{valor}</p>
      </div>
    </div>
  );
};

export default TarjetaResumen;
