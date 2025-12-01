import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsInt, IsNumber, Min } from 'class-validator';

export class CreatePedidoProductoDto {
  @ApiProperty()
  @IsDefined({ message: 'El campo id del Pedido debe estar definido' })
  @IsInt({ message: 'El campo id del Pedido debe ser numérico' })
  idPedido: number;

  @ApiProperty()
  @IsDefined({ message: 'El campo id del Producto debe estar definido' })
  @IsInt({ message: 'El campo id del Producto debe ser numérico' })
  idProducto: number;

  @ApiProperty()
  @IsDefined({ message: 'El campo cantidad debe estar definido' })
  @IsInt({ message: 'El campo cantidad debe ser numérico' })
  @Min(1, { message: 'La cantidad mínima permitida es 1' })
  cantidad: number;

  @ApiProperty()
  @IsDefined({ message: 'El campo precioUnitario debe estar definido' })
  @IsNumber({}, { message: 'El campo precioUnitario debe ser numérico' })
  @Min(0, { message: 'El campo precioUnitario no puede ser negativo' })
  precioUnitario: number;
}
