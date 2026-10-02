const express = require('express');
const cors = require('cors');
require('dotenv').config();
console.log(process.env.PORT);

const clienteRoutes = require('./routes/rutasClientes');
const rutasProveedores = require('./routes/rutasProveedores');
const rutasProductos = require('./routes/rutasProductos');
const rutasVentas = require('./routes/rutasVentas');
const rutasReportes = require('./routes/rutasReportes');
const rutasFiltros = require('./routes/rutasFiltros');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    mensaje: "Bailen como juana la cubana"
  });
});

app.use('/clientes', clienteRoutes);
app.use('/proveedores', rutasProveedores);
app.use('/productos', rutasProductos);
app.use('/ventas', rutasVentas);
app.use('/reportes', rutasReportes);
app.use('/filtros', rutasFiltros);


const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});