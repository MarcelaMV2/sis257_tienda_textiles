import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago } from './entities/pago.entity';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Pago)
    private readonly pagosRepository: Repository<Pago>,
  ) {}

  async create(dto: CreatePagoDto): Promise<Pago> {
    const pago = new Pago();
    Object.assign(pago, dto);
    return this.pagosRepository.save(pago);
  }

  async findAll(): Promise<Pago[]> {
    return this.pagosRepository.find({ relations: ['pedido'] });
  }

  async findOne(id: number): Promise<Pago> {
    const pago = await this.pagosRepository.findOne({
      where: { id },
      relations: ['pedido'],
    });
    if (!pago) throw new NotFoundException('El pago no existe');
    return pago;
  }

  async update(id: number, dto: UpdatePagoDto): Promise<Pago> {
    const pago = await this.findOne(id);
    Object.assign(pago, dto);
    return this.pagosRepository.save(pago);
  }

  async remove(id: number): Promise<Pago> {
    const pago = await this.findOne(id);
    return this.pagosRepository.softRemove(pago);
  }
}
