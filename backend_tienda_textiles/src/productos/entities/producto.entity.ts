import { CarritoProductos } from 'src/carrito-productos/entities/carrito-producto.entity';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { Compra } from 'src/compras/entities/compra.entity';
import { PedidoProducto } from 'src/pedido_productos/entities/pedido_producto.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ValueTransformer,
} from 'typeorm';

// 👇 Transformer decimal → number
const decimalToNumber: ValueTransformer = {
  to: (value: number | null) => value,
  from: (value: string | null) => (value == null ? null : parseFloat(value)),
};

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer', { name: 'id_categoria' })
  idCategoria: number;

  @Column('varchar', { length: 60 })
  nombre: string;

  @Column('varchar', { length: 200 })
  descripcion: string;

  @Column('decimal', { precision: 10, scale: 2, transformer: decimalToNumber })
  precio: number;

  @Column()
  stock: number;

  @Column({ name: 'imagen_url', type: 'varchar', length: 500, nullable: true })
  imagenUrl: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @ManyToOne(() => Categoria, categoria => categoria.productos)
  @JoinColumn({ name: 'id_categoria', referencedColumnName: 'id' })
  categoria: Categoria;

  @OneToMany(() => CarritoProductos, carritoProductos => carritoProductos.producto)
  carritoProductos: CarritoProductos[];

  @OneToMany(() => PedidoProducto, pedidoProducto => pedidoProducto.producto)
  pedidosProductos: PedidoProducto[];

  @OneToMany(() => Compra, compra => compra.producto)
  compras: Compra[];
}
