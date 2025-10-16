import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreatePedidoProductoDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo id_pedido es obligatorio' })
  @IsNumber({}, { message: 'El campo id_pedido debe ser numérico' })
  readonly idPedido: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo id_producto es obligatorio' })
  @IsNumber({}, { message: 'El campo id_producto debe ser numérico' })
  readonly idProducto: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo cantidad es obligatorio' })
  @IsNumber({}, { message: 'El campo cantidad debe ser numérico' })
  @IsPositive({ message: 'La cantidad debe ser mayor a 0' })
  readonly cantidad: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo precio_unitario es obligatorio' })
  @IsNumber({}, { message: 'El campo precio_unitario debe ser numérico' })
  @IsPositive({ message: 'El precio_unitario debe ser mayor a 0' })
  readonly precioUnitario: number;
}
