import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

/**
 * Convierte una cadena de coordenadas POINT(lng lat) a un array [lat, lng]
 * @param {string} ubicacion - Cadena en formato POINT(longitud latitud)
 * @returns {Array|null} Array [latitud, longitud] o null si no se puede convertir
 */
function convertirPunto(ubicacion) {
  if (!ubicacion) {
    return null;
  }

  const coincidencia = ubicacion.match(
    /POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/i
  );

  if (!coincidencia) {
    return null;
  }

  const longitud = Number(coincidencia[1]);
  const latitud = Number(coincidencia[2]);

  return [latitud, longitud];
}

/**
 * Componente de mapa para mostrar ubicaciones geográficas
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.ubicacion] - Cadena de ubicación en formato POINT(lng lat)
 * @param {string} [props.titulo] - Título para mostrar en el popup del marcador
 * @returns {JSX.Element} Componente de mapa o mensaje de ubicación no disponible
 */
function MapaUbicacion({
  ubicacion,
  titulo,
}) {
  const posicion = convertirPunto(ubicacion);

  if (!posicion) {
    return (
      <div className="mapa-sin-ubicacion">
        No hay ubicación disponible.
      </div>
    );
  }

  return (
    <div className="contenedor-mapa">
      <MapContainer
        center={posicion}
        zoom={13}
        scrollWheelZoom={false}
        style={{
          width: "100%",
          height: "300px",
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={posicion}>
          <Popup>
            {titulo || "Ubicación"}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default MapaUbicacion;
