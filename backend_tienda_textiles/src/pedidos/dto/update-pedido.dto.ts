// update-pedido.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreatePedidoDto } from './create-pedido.dto';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdatePedidoDto extends PartialType(CreatePedidoDto) {
  @IsOptional()
  @IsString()
  @IsIn(['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'], {
    message: 'Estado inválido',
  })
  estado?: string;
}
