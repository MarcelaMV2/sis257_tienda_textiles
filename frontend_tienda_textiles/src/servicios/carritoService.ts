import http from '@/plugins/axios'

export const carritoService = {
  async crearCarrito(idUsuario: number | null) {
    const res = await http.post('/carritos', {
      id_usuario: idUsuario,
      estado: 'activo',
    })
    return res.data
  },

  async agregarProducto(idCarrito: number, idProducto: number, cantidad: number) {
    const res = await http.post('/carrito-productos', {
      id_carrito: idCarrito,
      id_producto: idProducto,
      cantidad,
    })
    return res.data
  },

  async obtenerCarrito(idCarrito: number) {
    const res = await http.get(`/carrito-productos?id_carrito=${idCarrito}`)
    return res.data
  },

  async eliminarProducto(id: number) {
    await http.delete(`/carrito-productos/${id}`)
  },
}
