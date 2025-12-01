export interface Proveedor {
  id: number
  nombre: string
  telefono?: string | null
  email?: string | null
  direccion?: string | null
  estado: string
}
