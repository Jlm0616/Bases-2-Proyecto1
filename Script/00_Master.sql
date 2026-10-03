-- ============================================================
-- 00_Master.sql
-- Script orquestador - Proyecto 1 Bases de Datos 2
--
-- Ejecuta todos los scripts del proyecto en el orden correcto
-- usando la directiva :r de SQLCMD.
--
-- REQUISITO: Tener activo "SQLCMD Mode" en SSMS:
--   Menú:  Query  ->  SQLCMD Mode
--
-- Uso:
--   1. Abrir este archivo en SSMS
--   2. Activar SQLCMD Mode
--   3. Presionar F5
-- ============================================================

USE WideWorldImporters;
GO

PRINT '============================================';
PRINT '   Proyecto 1 - Bases de Datos 2';
PRINT '   Reconstruyendo base de datos...';
PRINT '============================================';

-- ------------------------------------------------------------
-- 01 - Sinónimos
-- ------------------------------------------------------------
PRINT '';
PRINT '>>> [01/12] Creando sinonimos...';
:r .\01_Sinonimos.sql
GO

-- ------------------------------------------------------------
-- 02 - SPs de Clientes (listar + detalle)
-- ------------------------------------------------------------
PRINT '';
PRINT '>>> [02/12] Creando SPs de Clientes...';
:r .\02_SP_Clientes.sql
GO

-- ------------------------------------------------------------
-- 03 - SPs de Proveedores (listar + detalle)
-- ------------------------------------------------------------
PRINT '';
PRINT '>>> [03/12] Creando SPs de Proveedores...';
:r .\03_SP_Proveedores.sql
GO

-- ------------------------------------------------------------
-- 04 - SPs de Productos (listar + detalle)
-- ------------------------------------------------------------
PRINT '';
PRINT '>>> [04/12] Creando SPs de Productos...';
:r .\04_SP_Productos.sql
GO

-- ------------------------------------------------------------
-- 05 - SPs de Ventas (listar + detalle)
-- ------------------------------------------------------------
PRINT '';
PRINT '>>> [05/12] Creando SPs de Ventas...';
:r .\05_SP_Ventas.sql
GO

-- ------------------------------------------------------------
-- 06 - SPs de Reportes (10 reportes)
-- ------------------------------------------------------------
PRINT '';
PRINT '>>> [06/12] Creando SPs de Reportes...';
:r .\06_SP_Reportes.sql
GO

-- ------------------------------------------------------------
-- 07a - CRUD Clientes
-- ------------------------------------------------------------
PRINT '';
PRINT '>>> [07a/12] Creando CRUD de Clientes...';
:r .\07a_CRUD_Clientes.sql
GO

-- ------------------------------------------------------------
-- 07b - CRUD Proveedores
-- ------------------------------------------------------------
PRINT '';
PRINT '>>> [07b/12] Creando CRUD de Proveedores...';
:r .\07b_CRUD_Proveedores.sql
GO

-- ------------------------------------------------------------
-- 07c - CRUD Productos
-- ------------------------------------------------------------
PRINT '';
PRINT '>>> [07c/12] Creando CRUD de Productos...';
:r .\07c_CRUD_Productos.sql
GO

-- ------------------------------------------------------------
-- 07d - CRUD Ventas (incluye CREATE TYPE TipoLineasFactura)
-- ------------------------------------------------------------
PRINT '';
PRINT '>>> [07d/12] Creando CRUD de Ventas y TVP...';
:r .\07d_CRUD_Ventas.sql
GO

-- ------------------------------------------------------------
-- 08a - SPs de Filtros (catálogos para <select> del front)
-- ------------------------------------------------------------
PRINT '';
PRINT '>>> [08a/12] Creando SPs de Filtros...';
:r .\08_SP_Filtros.sql
GO

-- ------------------------------------------------------------
-- 08b - Ejemplos de ejecución (opcional)
-- ------------------------------------------------------------
PRINT '';
PRINT '>>> [08b/12] Ejecutando ejemplos de prueba...';
:r .\08_EjemplosEjecucion.sql
GO

-- ------------------------------------------------------------
-- Fin
-- ------------------------------------------------------------
PRINT '';
PRINT '============================================';
PRINT '   Base de datos reconstruida con exito.';
PRINT '============================================';
GO