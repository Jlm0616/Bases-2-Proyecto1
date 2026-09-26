const express = require('express');
const cors = require('cors');
require('dotenv').config();

const clienteRoutes = require('./routes/clienteRoutes');
const rutasProveedores = require('./routes/rutasProveedores');
const rutasProductos = require('./routes/rutasProductos');
const rutasVentas = require('./routes/rutasVentas');

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

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});