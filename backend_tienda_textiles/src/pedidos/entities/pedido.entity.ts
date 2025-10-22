import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { PedidoProducto } from 'src/pedido_productos/entities/pedido_producto.entity';
import { Pago } from 'src/pagos/entities/pago.entity';

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer', { name: 'id_usuario' })
  idUsuario: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column({ default: 'pendiente' })
  estado: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @ManyToOne(() => Usuario, usuario => usuario.pedidos)
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id' })
  usuario: Usuario;

  @OneToMany(() => PedidoProducto, pedidosProducto => pedidosProducto.pedido)
  pedidosProductos: PedidoProducto[];

  @OneToMany(() => Pago, pago => pago.pedido)
  pagos: Pago[];
}
