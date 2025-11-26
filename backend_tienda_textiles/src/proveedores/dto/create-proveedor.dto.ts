import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength, IsEmail } from 'class-validator';

export class CreateProveedorDto {
  @ApiProperty({ description: 'Nombre del proveedor', example: 'Mayorista La Paz SRL' })
  @IsNotEmpty({ message: 'El campo nombre es obligatorio' })
  @IsString({ message: 'El campo nombre debe ser de tipo cadena' })
  @MaxLength(150, { message: 'El campo nombre no debe superar los 150 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  readonly nombre: string;

  @ApiProperty({ description: 'Teléfono del proveedor', example: '70012345', required: false })
  @IsOptional()
  @IsString({ message: 'El campo telefono debe ser de tipo cadena' })
  @MaxLength(50, { message: 'El campo telefono no debe superar los 50 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  readonly telefono?: string;

  @ApiProperty({
    description: 'Correo electrónico del proveedor',
    example: 'contacto@mayorista.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'El campo email debe ser un correo válido' })
  @MaxLength(150, { message: 'El campo email no debe superar los 150 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  readonly email?: string;

  @ApiProperty({
    description: 'Dirección del proveedor',
    example: 'Calle Ayacucho #123, Zona Central',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El campo direccion debe ser de tipo cadena' })
  @MaxLength(255, { message: 'El campo direccion no debe superar los 255 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  readonly direccion?: string;

  @ApiProperty({
    description: 'Estado del proveedor',
    example: 'activo',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El campo estado debe ser de tipo cadena' })
  @MaxLength(20, { message: 'El campo estado no debe superar los 20 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  readonly estado?: string;
}
