import http from '@/plugins/axios'

export const pedidosService = {
  async crearPedido(pedido: any) {
    const res = await http.post('/pedidos', pedido)
    return res.data
  },

  async agregarProductos(idPedido: number, productos: any[]) {
    for (const producto of productos) {
      await http.post('/pedido-productos', {
        id_pedido: idPedido,
        id_producto: producto.id_producto,
        cantidad: producto.cantidad,
        precio_unitario: producto.precio_unitario,
      })
    }
  },

  async registrarPago(idPedido: number, metodo: string, monto: number) {
    const res = await http.post('/pagos', {
      id_pedido: idPedido,
      metodo,
      monto,
      estado: 'pendiente',
    })
    return res.data
  },
}
