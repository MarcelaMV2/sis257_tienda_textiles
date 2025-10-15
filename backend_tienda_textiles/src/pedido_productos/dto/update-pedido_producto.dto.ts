import { PartialType } from '@nestjs/mapped-types';
import { CreatePedidoProductoDto } from './create-pedido_producto.dto';

export class UpdatePedidoProductoDto extends PartialType(CreatePedidoProductoDto) {}
