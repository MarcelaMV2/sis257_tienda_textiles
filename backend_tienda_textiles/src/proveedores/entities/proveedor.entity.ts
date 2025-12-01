import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Compra } from 'src/compras/entities/compra.entity'; // ← la crearás luego

@Entity('proveedores')
export class Proveedor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 150 })
  nombre: string;

  @Column('varchar', { length: 50, nullable: true })
  telefono: string;

  @Column('varchar', { length: 150, nullable: true })
  email: string;

  @Column('varchar', { length: 255, nullable: true })
  direccion: string;

  @Column('varchar', { length: 20, default: 'activo' })
  estado: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @OneToMany(() => Compra, compra => compra.proveedor)
  compras: Compra[];
}
