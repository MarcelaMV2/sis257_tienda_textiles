import { PartialType } from '@nestjs/swagger';
import { CreateProveedorDto as CreateProveedorDto } from './create-proveedor.dto';

export class UpdateProveedorDto extends PartialType(CreateProveedorDto) {}
