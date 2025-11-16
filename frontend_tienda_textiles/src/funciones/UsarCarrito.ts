import type { Producto } from '@/models/producto'
import { ref, watch } from 'vue'

interface ItemCarrito {
  producto: Producto
  cantidad: number
}

const carrito = ref<ItemCarrito[]>([])

// ✅ Cargar carrito guardado en localStorage al iniciar
if (localStorage.getItem('carrito')) {
  carrito.value = JSON.parse(localStorage.getItem('carrito')!)
}

// ✅ Guardar automáticamente cada vez que el carrito cambie
watch(
  carrito,
  (nuevoValor) => {
    localStorage.setItem('carrito', JSON.stringify(nuevoValor))
  },
  { deep: true },
)

export function usarCarrito() {
  // 🛒 Agregar producto al carrito
  const agregarProducto = (producto: Producto, cantidad = 1) => {
    const existente = carrito.value.find((p) => p.producto.id === producto.id)
    if (existente) {
      existente.cantidad += cantidad
    } else {
      carrito.value.push({ producto, cantidad })
    }
  }

  // ➕ Incrementar cantidad
  const incrementarCantidad = (id: number) => {
    const item = carrito.value.find((p) => p.producto.id === id)
    if (item) item.cantidad++
  }

  // ➖ Disminuir cantidad
  const disminuirCantidad = (id: number) => {
    const item = carrito.value.find((p) => p.producto.id === id)
    if (item && item.cantidad > 1) {
      item.cantidad--
    } else if (item && item.cantidad === 1) {
      // Si llega a 0, lo eliminamos del carrito
      eliminarProducto(id)
    }
  }

  // ❌ Eliminar producto
  const eliminarProducto = (id: number) => {
    carrito.value = carrito.value.filter((p) => p.producto.id !== id)
  }

  // 🧹 Vaciar carrito
  const vaciarCarrito = () => {
    carrito.value = []
  }

  // 💰 Calcular total
  const totalCarrito = () =>
    carrito.value.reduce((total, item) => total + item.producto.precio * item.cantidad, 0)

  return {
    carrito,
    agregarProducto,
    eliminarProducto,
    vaciarCarrito,
    totalCarrito,
    incrementarCantidad,
    disminuirCantidad,
  }
}
