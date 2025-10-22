import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Pedido } from '../../pedidos/entities/pedido.entity';

@Entity('pagos')
export class Pago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer', { name: 'id_pedido' })
  idPedido: number;

  @Column({ type: 'varchar', length: 50 })
  metodo: string;

  @Column('decimal', { precision: 10, scale: 2 })
  monto: number;

  @Column({ default: 'pendiente' })
  estado: string;

  @CreateDateColumn({ name: 'fecha_pago' })
  fechaPago: Date;


  @ManyToOne(() => Pedido, pedido => pedido.pagos)
  @JoinColumn({ name: 'id_pedido', referencedColumnName: 'id' })
  pedido: Pedido;
}
