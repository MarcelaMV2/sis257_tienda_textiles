import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDefined, IsInt, IsNotEmpty, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateCarritoProductosDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo cantidad no debe estar vacío' })
  @IsInt({ message: 'El campo cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad mínima permitida es 1' })
  @Max(100, { message: 'La cantidad máxima permitida es 100' })
  cantidad: number;

  @ApiProperty()
  @IsDefined({ message: 'El campo id del Producto debe estar definido' })
  @IsInt({ message: 'El campo id del Producto debe ser numérico' })
  idProducto: number;

  @ApiProperty()
  @IsDefined({ message: 'El campo id del Producto debe estar definido' })
  @IsInt({ message: 'El campo id del Producto debe ser numérico' })
  idCarrito: number;
}
