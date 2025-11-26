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
} from 'typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { PedidoProducto } from 'src/pedido_productos/entities/pedido_producto.entity';
import { Pago } from 'src/pagos/entities/pago.entity';
import { Departamento } from 'src/departamentos/entities/departamento.entity';

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('integer', { name: 'id_usuario' })
  idUsuario: number;

  /* @Column('varchar', { length: 100, nullable: true })
  departamento: string; */
  @Column('int', { name: 'id_departamento' })
  idDepartamento: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column('varchar', { length: 20, default: 'pendiente' })
  estado: string;

  @Column('varchar', { length: 100, nullable: true })
  pais: string;

  @Column('varchar', { length: 100, nullable: true })
  ciudad: string;

  @Column('varchar', { length: 255, nullable: true })
  direccion: string;

  @Column('varchar', { length: 255, nullable: true })
  referencia: string;

  @Column('varchar', { length: 20, default: 'domicilio' })
  tipoEnvio: string;

  @Column('varchar', { length: 20 })
  metodoPago: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @ManyToOne(() => Usuario, usuario => usuario.pedidos)
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id' })
  usuario: Usuario;

  @OneToMany(() => PedidoProducto, pedidosProducto => pedidosProducto.pedido)
  pedidosProductos: PedidoProducto[];

  @OneToMany(() => Pago, pago => pago.pedido)
  pagos: Pago[];

  @ManyToOne(() => Departamento, departamento => departamento.pedidos)
  @JoinColumn({ name: 'id_departamento', referencedColumnName: 'id' })
  departamento: Departamento;
}
