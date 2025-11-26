export interface Usuario {
  id: number
  nombre: string
  apellidos: string
  email: string
  telefono: string
  clave?: string
  rol: string
  fechaCreacion: Date | string
  fechaModificacion: Date | string
  fechaEliminacion?: Date | string | null
}
