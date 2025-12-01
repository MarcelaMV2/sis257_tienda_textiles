import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePedidoProductoDto } from './dto/create-pedido_producto.dto';
import { UpdatePedidoProductoDto } from './dto/update-pedido_producto.dto';
import { PedidoProducto } from './entities/pedido_producto.entity';
import { ProductosService } from 'src/productos/productos.service';

@Injectable()
export class PedidoProductosService {
  constructor(
    @InjectRepository(PedidoProducto)
    private pedidoProductoRepository: Repository<PedidoProducto>,
    private readonly productosService: ProductosService,
  ) {}

  async create(createPedidoProductoDto: CreatePedidoProductoDto): Promise<PedidoProducto> {
    const pedidoProducto = new PedidoProducto();
    Object.assign(pedidoProducto, createPedidoProductoDto);

    // 1) Guardamos el detalle del pedido
    const detalleGuardado = await this.pedidoProductoRepository.save(pedidoProducto);

    // 2) Descontamos del stock del producto
    await this.productosService.disminuirStock(
      detalleGuardado.idProducto, // id del producto
      detalleGuardado.cantidad, // cantidad pedida
    );

    // 3) Devolvemos el detalle
    return detalleGuardado;
  }

  async findAll(): Promise<PedidoProducto[]> {
    return this.pedidoProductoRepository.find({
      relations: { pedido: true, producto: true },
      select: {
        id: true,
        idPedido: true,
        idProducto: true,
        cantidad: true,
        precioUnitario: true,
        pedido: { id: true },
        producto: { id: true, nombre: true, precio: true, imagenUrl: true },
      },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<PedidoProducto> {
    const pedidoProducto = await this.pedidoProductoRepository.findOne({
      where: { id },
      relations: { pedido: true, producto: true },
    });
    if (!pedidoProducto) throw new NotFoundException('El detalle del pedido no existe');
    return pedidoProducto;
  }

  async update(
    id: number,
    updatePedidoProductoDto: UpdatePedidoProductoDto,
  ): Promise<PedidoProducto> {
    const pedidoProducto = await this.findOne(id);
    Object.assign(pedidoProducto, updatePedidoProductoDto);
    return this.pedidoProductoRepository.save(pedidoProducto);
  }

  async remove(id: number): Promise<PedidoProducto> {
    const pedidoProducto = await this.findOne(id);
    return this.pedidoProductoRepository.softRemove(pedidoProducto);
  }
}
