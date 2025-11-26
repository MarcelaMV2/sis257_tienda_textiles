import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDefined,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateCompraDto {
  @ApiProperty({ description: 'ID del proveedor', example: 1 })
  @IsDefined({ message: 'El campo idProveedor debe estar definido' })
  @Type(() => Number)
  @IsInt({ message: 'El campo idProveedor debe ser un número entero' })
  readonly idProveedor: number;

  @ApiProperty({ description: 'ID del producto comprado', example: 5 })
  @IsDefined({ message: 'El campo idProducto debe estar definido' })
  @Type(() => Number)
  @IsInt({ message: 'El campo idProducto debe ser un número entero' })
  readonly idProducto: number;

  @ApiProperty({ description: 'Cantidad comprada del producto', example: 20 })
  @IsDefined({ message: 'El campo cantidad debe estar definido' })
  @Type(() => Number)
  @IsInt({ message: 'El campo cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  readonly cantidad: number;

  @ApiProperty({ description: 'Precio unitario de compra', example: 80.5 })
  @IsDefined({ message: 'El campo precioUnitario debe estar definido' })
  @Type(() => Number)
  @IsNumber({}, { message: 'El campo precioUnitario debe ser numérico' })
  @IsPositive({ message: 'El campo precioUnitario debe ser mayor a 0' })
  readonly precioUnitario: number;

  @ApiProperty({
    description: 'Monto total de la compra (cantidad * precioUnitario)',
    example: 1610.0,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El campo montoTotal debe ser numérico' })
  @IsPositive({ message: 'El campo montoTotal debe ser mayor a 0' })
  readonly montoTotal?: number;

  @ApiProperty({
    description: 'Observación o nota de la compra',
    example: 'Compra de reposición de stock para campaña navideña',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El campo observacion debe ser de tipo cadena' })
  @MaxLength(255, { message: 'El campo observacion no debe superar los 255 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  readonly observacion?: string;
}
