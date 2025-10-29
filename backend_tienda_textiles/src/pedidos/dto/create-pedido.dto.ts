import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDefined, IsInt, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreatePedidoDto {
  @ApiProperty({
    description: 'Identificador del usuario que realiza el pedido',
    example: 1,
  })
  @IsDefined({ message: 'El campo id del Usuario debe estar definido' })
  @IsInt({ message: 'El campo id del Usuario debe ser numérico' })
  idUsuario: number;

  @ApiProperty({
    description: 'Monto total del pedido',
    example: 150.75,
  })
  @IsDefined({ message: 'El campo total debe estar definido' })
  @IsNumber({}, { message: 'El campo total debe ser numérico' })
  @Min(0, { message: 'El campo total no puede ser negativo' })
  total: number;

  @ApiProperty({
    description: 'Estado del pedido',
    example: 'pendiente',
  })
  @IsOptional()
  @IsString({ message: 'El campo estado debe ser una cadena' })
  @MaxLength(20, { message: 'El campo estado no debe exceder los 20 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  estado?: string;

  @ApiProperty({
    description: 'Dirección completa de entrega del pedido',
    example: 'Calle Tomina #123, Zona Central',
  })
  @IsOptional()
  @IsString({ message: 'El campo dirección debe ser una cadena' })
  @MaxLength(255, { message: 'El campo dirección no debe exceder los 255 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  direccion?: string;

  @ApiProperty({
    description: 'Ciudad de entrega del pedido',
    example: 'Sucre',
  })
  @IsOptional()
  @IsString({ message: 'El campo ciudad debe ser una cadena' })
  @MaxLength(100, { message: 'El campo ciudad no debe exceder los 100 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  ciudad?: string;

  @ApiProperty({
    description: 'Departamento o región del pedido',
    example: 'Chuquisaca',
  })
  @IsOptional()
  @IsString({ message: 'El campo departamento debe ser una cadena' })
  @MaxLength(100, { message: 'El campo departamento no debe exceder los 100 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  departamento?: string;

  @ApiProperty({
    description: 'Tipo de envío seleccionado',
    example: 'rápido',
  })
  @IsOptional()
  @IsString({ message: 'El campo tipoEnvio debe ser una cadena' })
  @MaxLength(20, { message: 'El campo tipoEnvio no debe exceder los 20 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  tipoEnvio?: string;

  @ApiProperty({
    description: 'Método de pago del pedido',
    example: 'transferencia',
  })
  @IsOptional()
  @IsString({ message: 'El campo metodoPago debe ser una cadena' })
  @MaxLength(20, { message: 'El campo metodoPago no debe exceder los 20 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  metodoPago?: string;
}
