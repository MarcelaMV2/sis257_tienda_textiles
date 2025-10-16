import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidosRepository: Repository<Pedido>,
  ) {}

  async create(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    const pedido = new Pedido();
    pedido.usuario = { id: createPedidoDto.idUsuario } as any;
    pedido.total = createPedidoDto.total;
    pedido.estado = createPedidoDto.estado ?? 'pendiente';
    return this.pedidosRepository.save(pedido);
  }

  async findAll(): Promise<Pedido[]> {
    return this.pedidosRepository.find();
  }

  async findOne(id: number): Promise<Pedido> {
    const pedido = await this.pedidosRepository.findOne({ where: { id } });
    if (!pedido) throw new NotFoundException('El pedido no existe');
    return pedido;
  }

  async update(id: number, updatePedidoDto: UpdatePedidoDto): Promise<Pedido> {
    const pedido = await this.findOne(id);
    Object.assign(pedido, updatePedidoDto);
    return this.pedidosRepository.save(pedido);
  }

  async remove(id: number): Promise<Pedido> {
    const pedido = await this.findOne(id);
    return this.pedidosRepository.softRemove(pedido);
  }
}
