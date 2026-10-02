import TarjetaResumen from "../componentes/TarjetaResumen";
import "../estilos/inicio.css";

function Inicio() {
  const resumen = {
    clientes: 663,
    proveedores: 13,
    productos: 227,
    ventas: 70510,
  };

  const ventasRecientes = [
    {
      id: 70510,
      cliente: "Tailspin Toys",
      fecha: "2016-05-31",
      monto: 2450.5,
    },
    {
      id: 70509,
      cliente: "Wingtip Toys",
      fecha: "2016-05-31",
      monto: 1890.75,
    },
    {
      id: 70508,
      cliente: "Contoso",
      fecha: "2016-05-30",
      monto: 980.25,
    },
  ];

  return (
    <main className="contenido-inicio">
      <section className="encabezado-pagina">
        <h2>Resumen general</h2>
        <p>Información general del sistema WideWorldImporters.</p>
      </section>

      <section className="tarjetas">
        <TarjetaResumen
          titulo="Clientes"
          valor={resumen.clientes}
          descripcion="Clientes registrados"
        />

        <TarjetaResumen
          titulo="Proveedores"
          valor={resumen.proveedores}
          descripcion="Proveedores registrados"
        />

        <TarjetaResumen
          titulo="Productos"
          valor={resumen.productos}
          descripcion="Productos disponibles"
        />

        <TarjetaResumen
          titulo="Ventas"
          valor={resumen.ventas}
          descripcion="Facturas registradas"
        />
      </section>

      <section className="seccion-tabla">
        <div className="titulo-seccion">
          <h3>Ventas recientes</h3>
          <p>Últimas ventas registradas en el sistema.</p>
        </div>

        <div className="contenedor-tabla">
          <table>
            <thead>
              <tr>
                <th>Factura</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Monto</th>
              </tr>
            </thead>

            <tbody>
              {ventasRecientes.map((venta) => (
                <tr key={venta.id}>
                  <td>#{venta.id}</td>
                  <td>{venta.cliente}</td>
                  <td>{venta.fecha}</td>
                  <td>${venta.monto.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default Inicio;
