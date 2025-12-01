import { PartialType } from '@nestjs/swagger';
import { CreatePedidoProductoDto } from './create-pedido_producto.dto';

export class UpdatePedidoProductoDto extends PartialType(CreatePedidoProductoDto) {}
