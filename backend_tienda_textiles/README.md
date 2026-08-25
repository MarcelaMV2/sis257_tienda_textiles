# 🧵 Sansa Designs - Backend API

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-Backend-E0234E?style=for-the-badge&logo=nestjs" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker" />
  <img src="https://img.shields.io/badge/Nginx-Reverse%20Proxy-009639?style=for-the-badge&logo=nginx" />
  <img src="https://img.shields.io/badge/JWT-Authentication-black?style=for-the-badge&logo=jsonwebtokens" />
</p>


# 📌 Descripción del proyecto

**Sansa Designs - Backend API** es el servicio backend desarrollado para el sistema integral de gestión y venta de productos textiles artesanales.

Este proyecto proporciona una API REST encargada de administrar la lógica de negocio, autenticación, seguridad y comunicación con la base de datos para la plataforma **Sansa Designs**.

El backend fue desarrollado utilizando **NestJS con TypeScript**, implementando una arquitectura modular, segura y escalable.


---

# 🎯 Objetivo del backend

Proporcionar una infraestructura backend capaz de gestionar:

- Usuarios y autenticación.
- Roles y permisos.
- Productos.
- Categorías.
- Inventario.
- Proveedores.
- Pedidos.
- Pagos.
- Reportes administrativos.


---

# 🏗️ Arquitectura del sistema

El backend sigue una arquitectura basada en servicios:

```
Cliente Web
     |
     |
     ↓
Nginx
(Reverse Proxy)
     |
     |
     ↓
NestJS API
     |
     |
     ↓
Base de Datos
```

### Componentes principales:

| Componente | Función |
|-|-|
| NestJS | Framework backend principal |
| JWT | Sistema de autenticación y autorización |
| Docker | Contenerización del servicio |
| Nginx | Proxy inverso y gestión del tráfico |
| Base de datos | Persistencia de información |


---

# 🔐 Seguridad y autenticación

El sistema implementa autenticación basada en **JSON Web Token (JWT)**.

Características:

- Inicio de sesión seguro.
- Generación de tokens de acceso.
- Protección de rutas privadas.
- Control de acceso mediante roles.
- Validación de usuarios.


Flujo de autenticación:

```
Usuario
  |
  ↓
Login
  |
  ↓
Validación de credenciales
  |
  ↓
Generación JWT
  |
  ↓
Acceso a recursos protegidos
```


---

# 🚀 Funcionalidades principales


## 👥 Usuarios

Gestión de usuarios del sistema:

- Registro.
- Autenticación.
- Roles.
- Administración de perfiles.


## 🛍️ Productos

Administración del catálogo:

- Crear productos.
- Actualizar información.
- Gestionar categorías.
- Controlar disponibilidad.


## 📦 Inventario

Control de:

- Productos disponibles.
- Materiales.
- Existencias.


## 🚚 Proveedores

Registro y administración de proveedores relacionados con materiales e insumos.


## 🛒 Pedidos

Gestión de compras:

- Registro de pedidos.
- Estado del pedido.
- Productos asociados.


## 💳 Pagos

Administración de información relacionada con transacciones.


## 📊 Reportes

Generación de información administrativa para análisis del negocio.


---

# 🛠️ Tecnologías utilizadas

| Tecnología | Uso |
|-|-|
| NestJS | Framework backend |
| TypeScript | Lenguaje principal |
| Node.js | Entorno de ejecución |
| JWT | Autenticación |
| Docker | Contenedores |
| Docker Compose | Orquestación de servicios |
| Nginx | Proxy inverso |
| PostgreSQL | Base de datos |


---

# 📂 Estructura del proyecto

Ejemplo de organización:

```
src/

├── auth/
│   └── Autenticación JWT
│
├── users/
│   └── Gestión de usuarios
│
├── products/
│   └── Gestión de productos
│
├── categories/
│   └── Categorías
│
├── inventory/
│   └── Control de inventario
│
├── orders/
│   └── Gestión de pedidos
│
├── payments/
│   └── Procesamiento de pagos
│
├── reports/
│   └── Reportes
│
└── main.ts
```

---

# ⚙️ Instalación local


## Requisitos

Antes de ejecutar el proyecto es necesario tener instalado:

- Node.js
- Docker
- Docker Compose


---

## Instalación de dependencias

```bash
npm install
```


---

# 🔧 Variables de entorno

Crear archivo:

```
.env
```

Ejemplo:

```env
PORT=3000

DATABASE_URL=

JWT_SECRET=

JWT_EXPIRES_IN=
```

*(Las variables pueden variar según la configuración del proyecto.)*


---

# ▶️ Ejecución del proyecto


## Desarrollo local

```bash
npm run start:dev
```


## Producción

```bash
npm run start:prod
```


---

# 🐳 Ejecución mediante Docker


Construir imágenes:

```bash
docker compose build
```


Levantar servicios:

```bash
docker compose up
```


Ejecutar en segundo plano:

```bash
docker compose up -d
```


Detener servicios:

```bash
docker compose down
```


---

# 🌐 Nginx

Nginx funciona como punto de entrada del sistema permitiendo:

- Administración de solicitudes HTTP.
- Redirección hacia la API NestJS.
- Separación entre cliente y servidor.
- Preparación para despliegue en producción.


---

# 🔗 Integración con Frontend

Este backend proporciona los servicios consumidos por:

📌 **Sansa Designs Frontend**

Repositorio relacionado:

```
frontend_tienda_textiles
```


---

# 📌 Estado del proyecto

🚧 Proyecto académico en desarrollo.


Desarrollado como proyecto final para:

**SIS257 - Ingeniería de Software**


---

# 👨‍💻 Autor

Proyecto desarrollado para la implementación de una plataforma web orientada a la digitalización de procesos comerciales.


---

# 📄 Licencia

Proyecto desarrollado con fines académicos.
