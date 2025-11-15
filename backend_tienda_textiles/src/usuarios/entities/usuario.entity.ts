import { compare, genSalt, hash } from 'bcrypt';
import { Carrito } from 'src/carritos/entities/carrito.entity';
import { Pedido } from 'src/pedidos/entities/pedido.entity';
import {
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  Entity,
  CreateDateColumn,
  OneToMany,
  BeforeUpdate,
  BeforeInsert,
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

  @Column('varchar', { length: 20 })
  telefono: string;

  @Column('varchar', { length: 200 })
  clave: string;

  @Column('varchar', { length: 20 })
  rol: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @OneToMany(() => Carrito, carrito => carrito.usuario)
  carritos: Carrito[];

  @OneToMany(() => Pedido, pedido => pedido.usuario)
  pedidos: Pedido[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    const salt = await genSalt();
    this.clave = await hash(this.clave, salt);
  }

  async validatePassword(plainPassword: string): Promise<boolean> {
    return compare(plainPassword, this.clave);
  }
}
