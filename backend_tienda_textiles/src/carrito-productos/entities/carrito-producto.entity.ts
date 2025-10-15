import { Carrito } from 'src/carritos/entities/carrito.entity';
import { Producto } from 'src/productos/entities/producto.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('carrito_productos')
export class CarritoProductos {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('integer')
  cantidad: number;

  @Column('integer', { name: 'id_carrito' })
  idCarrito: number;

  @Column('integer', { name: 'id_producto' })
  idProducto: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @ManyToOne(() => Producto, producto => producto.carritoProductos)
  @JoinColumn({ name: 'id_producto', referencedColumnName: 'id' })
  producto: Producto;

  @ManyToOne(() => Carrito, carrito => carrito.carritoProductos)
  @JoinColumn({ name: 'id_carrito', referencedColumnName: 'id' })
  carrito: Carrito;
}
