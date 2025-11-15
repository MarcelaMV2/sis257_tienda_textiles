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

    // normalizar método
    const metodo = (dto.metodo || '').toLowerCase().trim();
    pago.metodo = metodo;

    // estado inicial por método
    // transferencia/qr con comprobante => en_revision
    // tarjeta (simulada) => pendiente
    // otro => pendiente
    pago.estado =
      dto.estado?.trim().toLowerCase() ??
      (metodo === 'transferencia' || metodo === 'qr'
        ? dto.comprobante
          ? 'en_revision'
          : 'pendiente'
        : 'pendiente');

    // maskedCard solo aplica a tarjeta
    if (metodo !== 'tarjeta') {
      pago.maskedCard = null;
    }

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
