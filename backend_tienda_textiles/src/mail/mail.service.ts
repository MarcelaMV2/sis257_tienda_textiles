import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailer: MailerService) {}

  async enviarConfirmacionPedido(payload: {
    para: string;
    pedido: { id: number; total: number; metodoPago: string; direccion: string; estado: string };
    usuario: { nombre: string };
  }) {
    await this.mailer.sendMail({
      to: payload.para,
      subject: `Confirmación de pedido #${payload.pedido.id}`,
      template: 'pedido-confirmacion', // 👈 sin "./" ni ".hbs"
      context: payload,
    });
  }
}
