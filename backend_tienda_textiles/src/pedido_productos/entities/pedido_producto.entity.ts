import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Pedido } from '../../pedidos/entities/pedido.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('pedido_productos')
export class PedidoProducto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer', { name: 'id_pedido' })
  idPedido: number;

  @Column('integer', { name: 'id_producto' })
  idProducto: number;

  @Column('int')
  cantidad: number;

  @Column('decimal', { precision: 10, scale: 2, name: 'precio_unitario' })
  precioUnitario: number;

  @ManyToOne(() => Pedido, pedido => pedido.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_pedido', referencedColumnName: 'id' })
  pedido: Pedido;

  @ManyToOne(() => Producto, producto => producto.id, { eager: true })
  @JoinColumn({ name: 'id_producto', referencedColumnName: 'id' })
  producto: Producto;
}
