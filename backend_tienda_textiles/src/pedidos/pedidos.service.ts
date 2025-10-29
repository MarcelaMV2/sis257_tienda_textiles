import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { Pedido } from './entities/pedido.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidosRepository: Repository<Pedido>,
    private readonly mailService: MailService, // 👈 nuevo
  ) {}

  async create(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    const pedido = new Pedido();
    Object.assign(pedido, createPedidoDto);

    const nuevoPedido = await this.pedidosRepository.save(pedido);

    // 👇 NUEVO: enviar correo de confirmación al cliente
    await this.enviarCorreoConfirmacion(nuevoPedido.id);

    return nuevoPedido;
  }

  async findAll(): Promise<Pedido[]> {
    return this.pedidosRepository.find({
      relations: { usuario: true },
      select: {
        id: true,
        total: true,
        estado: true,
        usuario: { id: true, nombre: true, email: true },
      },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Pedido> {
    const pedido = await this.pedidosRepository.findOne({
      where: { id },
      relations: { usuario: true, pedidosProductos: true },
    });
    if (!pedido) throw new NotFoundException('El pedido no existe');
    return pedido;
  }

  async update(id: number, updatePedidoDto: UpdatePedidoDto): Promise<Pedido> {
    const pedido = await this.findOne(id);
    Object.assign(pedido, updatePedidoDto);

    if (updatePedidoDto.idUsuario) {
      pedido.idUsuario = updatePedidoDto.idUsuario;
    }

    return this.pedidosRepository.save(pedido);
  }

  async remove(id: number): Promise<Pedido> {
    const pedido = await this.findOne(id);
    return this.pedidosRepository.softRemove(pedido);
  }

  // 🔹 Enviar correo de confirmación de pedido
  async enviarCorreoConfirmacion(id: number): Promise<void> {
    const pedido = await this.pedidosRepository.findOne({
      where: { id },
      relations: { usuario: true, pedidosProductos: { producto: true } },
    });

    if (!pedido) throw new NotFoundException('El pedido no existe');

    // Aquí llamas al servicio de correo con todos los datos del pedido
    await this.mailService.enviarConfirmacionPedido({
      para: pedido.usuario.email,
      pedido: {
        id: pedido.id,
        total: pedido.total,
        metodoPago: pedido.metodoPago,
        direccion: pedido.direccion,
        estado: pedido.estado,
      },
      usuario: {
        nombre: pedido.usuario.nombre,
      },
    });
  }
}
