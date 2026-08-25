# 🧵 Sansa Designs - Frontend

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3-42b883?style=for-the-badge&logo=vuedotjs" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Vite-Latest-purple?style=for-the-badge&logo=vite" />
</p>

## 📌 Descripción del proyecto

**Sansa Designs - Frontend** es la aplicación web cliente desarrollada para el sistema integral de gestión y venta de productos textiles artesanales.

El proyecto pertenece al emprendimiento **Sansa Designs**, ubicado en Sucre - Bolivia, dedicado a la elaboración y comercialización de productos textiles como:

- 👜 Carteras
- 👛 Billeteras
- 🎒 Bolsos
- 🛋️ Cojines
- Productos artesanales elaborados con materiales naturales como lino, lana y yute.

Este repositorio contiene la interfaz gráfica del sistema, encargada de proporcionar una experiencia moderna, rápida e intuitiva para clientes y administradores.

---

# 🎯 Objetivo del frontend

Desarrollar una plataforma web amigable que permita:

- Mostrar el catálogo de productos textiles.
- Facilitar la navegación de los usuarios.
- Gestionar productos mediante una interfaz administrativa.
- Permitir la interacción con el carrito de compras.
- Consumir servicios proporcionados por la API backend.
- Mejorar la gestión comercial mediante herramientas digitales.

---

# ✨ Características principales

## 👥 Gestión de usuarios

- Inicio de sesión.
- Manejo de roles de usuario.
- Acceso diferenciado para clientes y administradores.

## 🛍️ Catálogo de productos

- Visualización de productos disponibles.
- Organización por categorías.
- Consulta de información detallada.
- Visualización de precios e imágenes.

## 🛒 Carrito de compras

- Selección de productos.
- Control de cantidades.
- Preparación de pedidos.

## 📦 Administración

- Gestión de productos.
- Control de información del inventario.
- Administración de categorías.
- Visualización de información del sistema.

## 🔌 Comunicación con Backend

El frontend consume una API REST desarrollada con NestJS mediante solicitudes HTTP utilizando Axios.

---

# 🛠️ Tecnologías utilizadas

| Tecnología | Descripción |
|---|---|
| Vue 3 | Framework principal para construcción de interfaces |
| TypeScript | Lenguaje con tipado estático |
| Vite | Herramienta de desarrollo y compilación |
| Pinia | Gestión global del estado |
| Vue Router | Manejo de navegación entre vistas |
| Axios | Comunicación con servicios backend |
| CSS / Bootstrap / Tailwind | Diseño y estilos visuales |

---

# 🏗️ Estructura del proyecto

La organización principal del frontend sigue una estructura modular:

```
src/
│
├── assets/
│   └── Recursos estáticos
│
├── components/
│   └── Componentes reutilizables
│
├── views/
│   └── Vistas principales del sistema
│
├── router/
│   └── Configuración de rutas
│
├── stores/
│   └── Estados globales mediante Pinia
│
├── services/
│   └── Consumo de API mediante Axios
│
└── App.vue
```

---

# ⚙️ Instalación y configuración

## 1. Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
```

Ingresar al proyecto:

```bash
cd frontend_tienda_textiles
```

---

## 2. Instalar dependencias

```bash
npm install
```

---

## 3. Configurar variables de entorno

Crear un archivo:

```
.env
```

Agregar las variables necesarias para la conexión con el backend:

```env
VITE_API_URL=http://localhost:3000
```

*(Modificar según la configuración del backend.)*

---

# 🚀 Ejecución del proyecto

## Modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en:

```
http://localhost:5173
```

---

## Compilación para producción

```bash
npm run build
```

---

## Vista previa de producción

```bash
npm run preview
```

---

# 🔗 Integración con Backend

Este frontend funciona en conjunto con el repositorio:

📌 **Backend API - Sansa Designs**

Tecnologías utilizadas:

- NestJS
- TypeScript
- Node.js
- Base de datos relacional

La comunicación entre ambos módulos se realiza mediante servicios REST.

---

# 📸 Capturas del sistema

*(Agregar imágenes del sistema cuando estén disponibles)*

Ejemplo:

```
screenshots/

├── login.png
├── productos.png
├── carrito.png
└── dashboard.png
```

---

# 📌 Estado del proyecto

🚧 Proyecto académico en desarrollo.

Desarrollado como proyecto final para la asignatura:

**SIS257 - Ingeniería de Software**

---

# 👨‍💻 Autor

Proyecto desarrollado para la implementación de una solución informática orientada a la digitalización de procesos comerciales.

---

# 📄 Licencia

Este proyecto fue desarrollado con fines académicos.
