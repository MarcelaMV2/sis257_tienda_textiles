import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ValueTransformer,
} from 'typeorm';
import { Proveedor } from 'src/proveedores/entities/proveedor.entity';
import { Producto } from 'src/productos/entities/producto.entity';

// 👇 Igual que en Producto: decimal → number
const decimalToNumber: ValueTransformer = {
  to: (value: number | null) => value,
  from: (value: string | null) => (value == null ? null : parseFloat(value)),
};

@Entity('compras')
export class Compra {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'id_proveedor' })
  idProveedor: number;

  @Column('int', { name: 'id_producto' })
  idProducto: number;

  @Column('int')
  cantidad: number;

  // Precio unitario de compra del producto
  @Column('decimal', {
    name: 'precio_unitario',
    precision: 10,
    scale: 2,
    transformer: decimalToNumber,
  })
  precioUnitario: number;

  // Monto total de la compra (cantidad * precioUnitario)
  @Column('decimal', { name: 'monto_total', precision: 10, scale: 2, transformer: decimalToNumber })
  montoTotal: number;

  @Column('varchar', { length: 255, nullable: true })
  observacion: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @ManyToOne(() => Proveedor, proveedor => proveedor.compras)
  @JoinColumn({ name: 'id_proveedor', referencedColumnName: 'id' })
  proveedor: Proveedor;

  @ManyToOne(() => Producto, producto => producto.compras)
  @JoinColumn({ name: 'id_producto', referencedColumnName: 'id' })
  producto: Producto;
}
