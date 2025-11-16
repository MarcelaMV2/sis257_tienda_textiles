import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    private readonly mailService: MailService,
  ) {}

  async create(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    const pedido = new Pedido();
    Object.assign(pedido, createPedidoDto);

    const nuevoPedido = await this.pedidosRepository.save(pedido);

    // 👇 NUEVO: enviar correo de confirmación al cliente
    /* await this.enviarCorreoConfirmacion(nuevoPedido.id); */
    // después: el pedido se crea igual, y si el correo falla solo se registra el warning
    try {
      await this.enviarCorreoConfirmacion(nuevoPedido.id);
    } catch (err) {
      // usa tu logger si tienes; lo mantengo simple para no tocar más
      console.warn('[mail] no se pudo enviar confirmación:', err?.message ?? err);
    }

    return nuevoPedido;
  }

  async findAll(): Promise<Pedido[]> {
    return this.pedidosRepository.find({
      relations: { usuario: true },
      select: {
        id: true,
        total: true,
        estado: true,
        metodoPago: true,
        fechaCreacion: true,
        usuario: { id: true, nombre: true, email: true },
      },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Pedido> {
    const pedido = await this.pedidosRepository.findOne({
      where: { id },
      relations: {
        usuario: true,
        // trae los detalles + el producto (nombre, imagen, precio, etc.)
        pedidosProductos: { producto: true },
        // trae los pagos asociados (metodo, estado, comprobante, maskedCard…)
        pagos: true,
      },
      order: {
        pedidosProductos: { id: 'ASC' },
        pagos: { id: 'ASC' },
      },
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
    const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      console.warn('[mail] SMTP no configurado; se omite envío');
      return;
    }
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

  async findByUser(idUsuario: number): Promise<Pedido[]> {
    return this.pedidosRepository.find({
      where: { idUsuario },
      relations: { pedidosProductos: { producto: true }, pagos: true },
      order: { id: 'DESC' },
    });
  }

  async cambiarEstado(id: number, estado: string): Promise<Pedido> {
    const permitidos = ['pendiente', 'entregado', 'enviado', 'confirmado', 'cancelado'];
    if (!permitidos.includes(estado)) {
      throw new BadRequestException('Estado inválido');
    }
    const pedido = await this.findOne(id);
    pedido.estado = estado;
    return this.pedidosRepository.save(pedido); // UpdateDateColumn se actualiza solo
  }
}
