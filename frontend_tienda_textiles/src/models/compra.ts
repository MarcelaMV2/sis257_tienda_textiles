import type { Proveedor } from './proveedor'
import type { Producto } from './producto'

export interface Compra {
  id: number
  idProveedor: number
  idProducto: number
  cantidad: number
  precioUnitario: number
  montoTotal: number
  observacion?: string
  fechaCreacion?: string
  proveedor?: Proveedor
  producto?: Producto
}
