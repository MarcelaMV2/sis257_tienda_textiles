import { PartialType } from '@nestjs/swagger';
import { CreateCarritoProductosDto } from './create-carrito-producto.dto';

export class UpdateCarritoProductosDto extends PartialType(CreateCarritoProductosDto) {}
