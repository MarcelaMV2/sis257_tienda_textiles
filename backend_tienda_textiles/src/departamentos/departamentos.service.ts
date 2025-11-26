import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Departamento } from './entities/departamento.entity';
import { CreateDepartamentoDto } from './dto/create-departamento.dto';
import { UpdateDepartamentoDto } from './dto/update-departamento.dto';

@Injectable()
export class DepartamentosService {
  constructor(
    @InjectRepository(Departamento)
    private readonly departamentosRepository: Repository<Departamento>,
  ) {}

  async create(createDepartamentoDto: CreateDepartamentoDto): Promise<Departamento> {
    const nombre = createDepartamentoDto.nombre.trim();

    const existe = await this.departamentosRepository.findOne({
      where: { nombre },
    });

    if (existe) {
      throw new ConflictException('El departamento ya existe');
    }

    const departamento = this.departamentosRepository.create({
      nombre,
    });

    return this.departamentosRepository.save(departamento);
  }

  async findAll(): Promise<Departamento[]> {
    return this.departamentosRepository.find({
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Departamento> {
    const departamento = await this.departamentosRepository.findOne({
      where: { id },
    });

    if (!departamento) {
      throw new NotFoundException('El departamento no existe');
    }

    return departamento;
  }

  async update(id: number, updateDepartamentoDto: UpdateDepartamentoDto): Promise<Departamento> {
    const departamento = await this.findOne(id);
    Object.assign(departamento, updateDepartamentoDto);
    return this.departamentosRepository.save(departamento);
  }

  async remove(id: number): Promise<Departamento> {
    const departamento = await this.findOne(id);
    return this.departamentosRepository.softRemove(departamento);
  }
}
