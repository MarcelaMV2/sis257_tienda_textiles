import { Carrito } from 'src/carritos/entities/carrito.entity';
import {
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  Entity,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 50 })
  nombre: string;

  @Column('varchar', { length: 50 })
  apellidos: string;

  @Column('varchar', { length: 100 })
  email: string;

  @Column('varchar', { length: 30 })
  password: string;

  @Column('varchar', { length: 20 })
  rol: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @OneToMany(() => Carrito, Carrito => Carrito.usuario)
  carritos: Carrito[];
}
