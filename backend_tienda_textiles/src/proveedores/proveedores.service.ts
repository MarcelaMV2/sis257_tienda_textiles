import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedor } from './entities/proveedor.entity';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';

@Injectable()
export class ProveedoresService {
  constructor(
    @InjectRepository(Proveedor)
    private readonly proveedoresRepository: Repository<Proveedor>,
  ) {}

  async create(createProveedorDto: CreateProveedorDto): Promise<Proveedor> {
    // Validar que no se repita el nombre
    let proveedor = await this.proveedoresRepository.findOneBy({
      nombre: createProveedorDto.nombre,
    });

    if (proveedor) {
      throw new ConflictException('El proveedor ya existe');
    }

    proveedor = new Proveedor();
    Object.assign(proveedor, createProveedorDto);
    return this.proveedoresRepository.save(proveedor);
  }

  async findAll(): Promise<Proveedor[]> {
    return this.proveedoresRepository.find({
      select: {
        id: true,
        nombre: true,
        telefono: true,
        email: true,
        direccion: true,
        estado: true,
      },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Proveedor> {
    const proveedor = await this.proveedoresRepository.findOne({
      where: { id },
    });

    if (!proveedor) {
      throw new NotFoundException('El proveedor no existe');
    }

    return proveedor;
  }

  async update(id: number, updateProveedorDto: UpdateProveedorDto): Promise<Proveedor> {
    const proveedor = await this.proveedoresRepository.findOneBy({ id });
    if (!proveedor) {
      throw new NotFoundException('El proveedor no existe');
    }

    Object.assign(proveedor, updateProveedorDto);
    return this.proveedoresRepository.save(proveedor);
  }

  async remove(id: number): Promise<Proveedor> {
    const proveedor = await this.findOne(id);
    return this.proveedoresRepository.softRemove(proveedor);
  }
}
