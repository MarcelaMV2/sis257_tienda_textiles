# 🧵 Sansa Designs  
## Sistema Web de Gestión y Venta de Productos Textiles Artesanales


<p align="center">
  <img src="https://img.shields.io/badge/Proyecto-SIS257-blue?style=for-the-badge">
  <img src="https://img.shields.io/badge/Frontend-Vue%203-42b883?style=for-the-badge&logo=vuedotjs">
  <img src="https://img.shields.io/badge/Backend-NestJS-E0234E?style=for-the-badge&logo=nestjs">
  <img src="https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker">
</p>


# 📌 Descripción del proyecto

**Sansa Designs** es un sistema web desarrollado para la gestión y comercialización de productos textiles artesanales en la ciudad de **Sucre - Bolivia**.

El proyecto está orientado a un emprendimiento dedicado a la elaboración y venta de productos textiles como:

- 👜 Carteras
- 👛 Billeteras
- 🎒 Bolsos
- 🛋️ Cojines
- Productos elaborados con materiales naturales como lino, lana y yute.


Actualmente, muchos procesos administrativos del emprendimiento se realizan de manera manual, generando dificultades en:

- Control de inventarios.
- Gestión de proveedores.
- Seguimiento de pedidos.
- Organización de ventas.
- Generación de reportes.

Por esta razón, se desarrolla una solución informática que permita digitalizar y optimizar estos procesos mediante una plataforma web moderna.


---

# 🎯 Objetivo del proyecto

Desarrollar un sistema integral que permita administrar los procesos comerciales y operativos de **Sansa Designs**, facilitando:

✅ La gestión de productos.  
✅ El control de inventario.  
✅ La administración de proveedores.  
✅ La gestión de usuarios y roles.  
✅ El procesamiento de pedidos.  
✅ El registro de pagos.  
✅ La generación de reportes para la toma de decisiones.


---

# 🏗️ Arquitectura del sistema


El proyecto está compuesto por dos aplicaciones principales:


```
Sansa Designs

│
├── 🖥️ Frontend
│      Vue 3 + TypeScript + Vite
│
│
└── ⚙️ Backend
       NestJS + TypeScript
       Docker + Nginx + JWT
```


La comunicación entre ambas capas se realiza mediante una API REST.


---

# 🚀 Tecnologías utilizadas


## Frontend

| Tecnología | Descripción |
|-|-|
| Vue 3 | Framework para interfaces web |
| TypeScript | Tipado estático |
| Vite | Herramienta de construcción |
| Pinia | Gestión del estado |
| Vue Router | Navegación |
| Axios | Comunicación con API |


---

## Backend

| Tecnología | Descripción |
|-|-|
| NestJS | Framework backend |
| TypeScript | Lenguaje principal |
| Node.js | Entorno de ejecución |
| JWT | Autenticación segura |
| Docker | Contenedores |
| Nginx | Proxy inverso |
| PostgreSQL | Base de datos |


---

# ✨ Módulos principales del sistema


## 👥 Usuarios

Permite administrar usuarios del sistema mediante roles diferenciados:

- Clientes.
- Administradores.


Incluye autenticación y control de acceso.


---

## 🛍️ Productos

Gestión del catálogo de productos:

- Nombre.
- Descripción.
- Precio.
- Categoría.
- Imagen.
- Disponibilidad.


---

## 🗂️ Categorías

Permite organizar los productos según su tipo:

Ejemplo:

- Carteras.
- Bolsos.
- Cojines.


---

## 📦 Inventario

Control de existencias:

- Productos terminados.
- Materiales.
- Cantidades disponibles.


---

## 🚚 Proveedores

Administración de información relacionada con proveedores y materiales.


---

## 🛒 Carrito de compras

Permite al cliente seleccionar productos antes de confirmar una compra.


---

## 📋 Pedidos

Registro y seguimiento de compras realizadas:

- Productos adquiridos.
- Cantidades.
- Estado del pedido.
- Total.


---

## 💳 Pagos

Registro de información asociada a las transacciones realizadas.


---

## 📊 Reportes

Generación de información administrativa para apoyar la toma de decisiones.


---

# 📂 Organización de repositorios


El proyecto se encuentra dividido en:


## 🖥️ Frontend

Repositorio:

```
frontend_tienda_textiles
```

Responsable de:

- Interfaz gráfica.
- Experiencia del usuario.
- Consumo de servicios API.


---

## ⚙️ Backend

Repositorio:

```
backend_tienda_textiles
```

Responsable de:

- Lógica del negocio.
- Seguridad.
- Autenticación.
- Gestión de datos.


---

# 🔐 Seguridad

El sistema implementa mecanismos de seguridad como:

- Autenticación mediante JWT.
- Control de acceso basado en roles.
- Protección de rutas privadas.
- Manejo seguro de sesiones.


---

# 🐳 Despliegue


El backend está preparado para ejecutarse mediante contenedores Docker.


Arquitectura de despliegue:

```
Usuario

 ↓

Frontend Web

 ↓

Nginx

 ↓

API NestJS

 ↓

Base de Datos
```


---

# 📸 Capturas del sistema


*(Agregar capturas de pantalla cuando estén disponibles)*


Ejemplo:

```
screenshots/

├── login.png
├── catalogo.png
├── carrito.png
├── dashboard.png
└── reportes.png
```


---

# 📌 Estado del proyecto

🚧 Proyecto académico en desarrollo.


Realizado para la asignatura:

## SIS257 - Ingeniería de Software


---

# 👨‍💻 Equipo de desarrollo

Proyecto desarrollado como propuesta de solución informática para la digitalización y optimización de procesos comerciales.


---

# 📄 Licencia

Este proyecto fue desarrollado con fines académicos.
