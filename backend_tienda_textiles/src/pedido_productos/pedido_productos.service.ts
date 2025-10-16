import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PedidoProducto } from './entities/pedido_producto.entity';
import { CreatePedidoProductoDto } from './dto/create-pedido_producto.dto';
import { UpdatePedidoProductoDto } from './dto/update-pedido_producto.dto';

@Injectable()
export class PedidoProductosService {
  constructor(
    @InjectRepository(PedidoProducto)
    private readonly pedidoProductosRepository: Repository<PedidoProducto>,
  ) {}

  async create(dto: CreatePedidoProductoDto): Promise<PedidoProducto> {
    const pedidoProducto = new PedidoProducto();
    Object.assign(pedidoProducto, dto);
    return this.pedidoProductosRepository.save(pedidoProducto);
  }

  async findAll(): Promise<PedidoProducto[]> {
    return this.pedidoProductosRepository.find({ relations: ['pedido', 'producto'] });
  }

  async findOne(id: number): Promise<PedidoProducto> {
    const pedidoProducto = await this.pedidoProductosRepository.findOne({
      where: { id },
      relations: ['pedido', 'producto'],
    });
    if (!pedidoProducto) throw new NotFoundException('El pedido_producto no existe');
    return pedidoProducto;
  }

  async update(id: number, dto: UpdatePedidoProductoDto): Promise<PedidoProducto> {
    const pedidoProducto = await this.findOne(id);
    Object.assign(pedidoProducto, dto);
    return this.pedidoProductosRepository.save(pedidoProducto);
  }

  async remove(id: number): Promise<PedidoProducto> {
    const pedidoProducto = await this.findOne(id);
    return this.pedidoProductosRepository.softRemove(pedidoProducto);
  }
}
