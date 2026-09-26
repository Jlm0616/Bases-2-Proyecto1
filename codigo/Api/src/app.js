const express = require('express');
const cors = require('cors');
require('dotenv').config();

const clienteRoutes = require('./routes/clienteRoutes');
const rutasProveedores = require('./routes/rutasProveedores');

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

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});