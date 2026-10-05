# Proyecto 1 - Bases de Datos 2

**WideWorldImporters - Aplicación Web de Gestión**

---

## Integrantes

| Nombre | Carné |
|---|---|
| Julian Lizano Monge | 2024188887 |
| Maikel Flores Navarro | 2024148346 |

**Curso:** Bases de Datos 2
**Fecha de entrega:** 4 de octubre de 2026, 10:00 PM

---

## Descripción del proyecto

Aplicación web full-stack para la gestión de la base de datos `WideWorldImporters` de Microsoft. Incluye cinco módulos funcionales (Clientes, Proveedores, Productos, Ventas, Reportes) con operaciones CRUD completas, filtros acumulativos, paginación, reportes estadísticos y visualización de ubicaciones en mapas.

El objetivo principal es que todo el procesamiento, búsqueda y transformación de datos ocurra del lado de la base de datos mediante procedimientos almacenados. La aplicación web actúa únicamente como capa de presentación y envío de parámetros.

---

## Tecnologías utilizadas

### Base de datos
- SQL Server 2025 (ejecutado en Docker)
- WideWorldImporters (base de datos de ejemplo de Microsoft)
- Sinónimos para acceso seguro a las tablas
- Stored Procedures con TRANSACTION / COMMIT / ROLLBACK
- TVP (Table-Valued Parameters) para inserción de líneas de venta

### Backend
- Node.js + Express
- mssql (driver para SQL Server)
- Puerto: 3000

### Frontend
- React 19 + Vite
- React Router (navegación entre módulos)
- Leaflet + React-Leaflet (mapas de ubicación)
- Puerto: 5173

---

## Estructura del proyecto

```
Bases-2-Proyecto1/
├── README.md
├── Api/                    # Backend (Node.js + Express)
│   ├── .env                # Variables de entorno (no subir a Git)
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── config/db.js
│       ├── controllers/    # Lógica de cada endpoint
│       └── routes/         # Definición de rutas
├── Script/                 # Scripts SQL
│   ├── 00_Master.sql
│   ├── 01_Sinonimos.sql
│   ├── 02_SP_Clientes.sql
│   ├── 03_SP_Proveedores.sql
│   ├── 04_SP_Productos.sql
│   ├── 05_SP_Ventas.sql
│   ├── 06_SP_Reportes.sql
│   ├── 07a_CRUD_Clientes.sql
│   ├── 07b_CRUD_Proveedores.sql
│   ├── 07c_CRUD_Productos.sql
│   ├── 07d_CRUD_Ventas.sql
│   ├── 08_EjemplosEjecucion.sql
│   └── 08_SP_Filtros.sql
└── WebSite/                # Frontend (React + Vite)
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── componentes/    # Componentes reutilizables
        ├── estilos/        # CSS por módulo
        ├── paginas/        # Páginas de la aplicación
        └── servicios/      # Llamadas a la API
```

---

## Cómo ejecutar el proyecto

### Requisitos previos
- Docker instalado y corriendo
- Node.js v18 o superior
- SQL Server Management Studio (SSMS) u otro cliente SQL

### 1. Levantar la base de datos

```powershell
docker start sqlserverlinux
docker ps
```

Credenciales de conexión:
- Servidor: localhost,1435
- Usuario: sa
- Contraseña: SqlServer1234!
- Base de datos: WideWorldImporters

### 2. Ejecutar los scripts SQL

En SSMS, ejecutar en orden:

```
Script/00_Master.sql
Script/01_Sinonimos.sql
Script/02_SP_Clientes.sql
Script/03_SP_Proveedores.sql
Script/04_SP_Productos.sql
Script/05_SP_Ventas.sql
Script/06_SP_Reportes.sql
Script/07a_CRUD_Clientes.sql
Script/07b_CRUD_Proveedores.sql
Script/07c_CRUD_Productos.sql
Script/07d_CRUD_Ventas.sql
Script/08_SP_Filtros.sql
```

### 3. Levantar el backend (API)

En una terminal:

```powershell
cd Api
npm install
npm start
```

El servidor debe estar corriendo en http://localhost:3000.

Configuración del archivo .env:

```
DB_SERVER=localhost
DB_PORT=1435
DB_USER=sa
DB_PASSWORD=SqlServer1234!
DB_NAME=WideWorldImporters
```

### 4. Levantar el frontend

En otra terminal:

```powershell
cd WebSite
npm install
npm run dev
```

La aplicación estará disponible en http://localhost:5173.

---

## Módulos implementados

### 1. Módulo de Clientes
- Tabla con nombre, categoría y método de entrega
- Filtros acumulativos: nombre (texto libre), categoría (selección), método de entrega (selección)
- Botón Restaurar filtros
- Orden alfabético por nombre
- Ventana de detalle con todos los campos requeridos
- Mapa interactivo (Leaflet) con la ubicación del cliente
- CRUD completo (crear, editar, eliminar)

### 2. Módulo de Proveedores
- Tabla con nombre, categoría y método de entrega
- Filtros acumulativos: nombre (texto libre), categoría (selección)
- Botón Restaurar filtros
- Orden alfabético por nombre
- Ventana de detalle con todos los campos requeridos (código, banco, cuenta corriente, etc.)
- Mapa interactivo con la ubicación del proveedor
- CRUD completo

### 3. Módulo de Productos (Inventarios)
- Tabla con nombre, grupo y cantidad en inventario
- Filtros acumulativos: nombre (texto libre), grupo (selección)
- Botón Restaurar filtros
- Orden alfabético por nombre
- Ventana de detalle con todos los campos requeridos
- Enlace al proveedor del producto (navega al módulo de Proveedores)
- CRUD completo

### 4. Módulo de Ventas
- Tabla con número de factura, fecha, cliente, método de entrega y monto
- Filtros acumulativos: cliente (texto libre), fecha (rango), monto (rango)
- Botón Restaurar filtros
- Paginación con selección de tamaño (25, 50, 100, 250)
- Ventana de detalle con encabezado y líneas de la factura
- Enlaces cruzados: cliente hacia módulo Clientes, producto hacia módulo Productos
- CRUD completo

### 5. Módulo de Reportes (10 reportes estadísticos)
1. Montos altos, bajos y promedio a proveedores (ROLLUP)
2. Montos altos, bajos y promedio de clientes (ROLLUP)
3. Top 5 productos por ganancia (DENSE_RANK + PARTITION)
4. Top 5 clientes por facturas (DENSE_RANK + PARTITION)
5. Top 5 proveedores por órdenes de compra (DENSE_RANK + PARTITION)
6. Matriz de ventas por categoría y año
7. Seguimiento de compras de clientes (con subcategoría)
8. Seguimiento de compras de proveedores (con subcategoría)
9. Rotación de inventario por producto
10. Método de envío favorito por zona

### 6. Página de Inicio
- Panel con resumen general del sistema
- Tarjetas con totales (clientes, proveedores, productos, ventas)
- Lista de ventas recientes

---

## Objetivos alcanzados

- Implementación completa de los 5 módulos funcionales (Clientes, Proveedores, Productos, Ventas, Reportes)
- Uso de sinónimos para todas las tablas accedidas desde los Stored Procedures
- Todos los accesos a datos se realizan por medio de procedimientos almacenados
- Uso de TRANSACTION / COMMIT / ROLLBACK en todas las operaciones de escritura
- Uso de TVP (Table-Valued Parameters) para inserción de líneas de factura
- Filtros acumulativos con función restaurar en todos los módulos
- Paginación en el módulo de Ventas
- 10 reportes estadísticos con ROLLUP, DENSE_RANK, PARTITION BY, PIVOT, LAG
- Mapas interactivos con Leaflet en Clientes y Proveedores
- Enlaces cruzados entre módulos (Producto a Proveedor, Venta a Cliente, Venta a Producto)
- Validación de datos en formularios
- Mensajes de error claros
- Interfaz intuitiva con colores diferenciados por módulo
- API REST que solo envía parámetros y devuelve resultados (sin transformación en el servidor)

## Objetivos no alcanzados

Todos los objetivos planteados en el enunciado fueron alcanzados.

---

## Video de demostración

Enlace al video en YouTube: [Ver video](https://youtu.be/F2EW7h7jgBE)

El video incluye una explicación del uso de la aplicación, el funcionamiento técnico (SQL, API, Frontend) y los detalles destacados del proyecto.

---

## Referencias

- WideWorldImporters database catalog: https://docs.microsoft.com/en-us/sql/samples/wide-world-importers-oltp-database-catalog
- DENSE_RANK - SQL Server: https://docs.microsoft.com/en-us/sql/t-sql/functions/dense-rank-transact-sql
- Leaflet - Interactive Maps: https://leafletjs.com/
- React-Leaflet: https://react-leaflet.js.org/
- Express.js: https://expressjs.com/
- React: https://react.dev/

---

## Notas adicionales

- El archivo .env con las credenciales de la base de datos no se sube al repositorio (está en .gitignore).
- Los scripts SQL son idempotentes (se pueden ejecutar múltiples veces sin efectos negativos).
- El script 08_EjemplosEjecucion.sql contiene un ejemplo de ejecución para cada Stored Procedure usado en la aplicación.
```