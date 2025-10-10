import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, MaxLength, IsPositive, IsOptional } from 'class-validator';

export class CreateProductoDto {
  @IsNotEmpty({ message: 'El campo id_categoria es obligatorio' })
  @IsNumber({}, { message: 'El campo id_categoria debe ser numérico' })
  readonly idCategoria: number;

  @IsNotEmpty({ message: 'El campo nombre es obligatorio' })
  @IsString({ message: 'El campo nombre debe ser de tipo cadena' })
  @MaxLength(60, { message: 'El campo nombre no debe superar los 60 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  readonly nombre: string;

  @IsNotEmpty({ message: 'El campo descripcion es obligatorio' })
  @IsString({ message: 'El campo descripcion debe ser de tipo cadena' })
  @MaxLength(200, { message: 'El campo descripcion no debe superar los 200 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  readonly descripcion: string;

  @IsNotEmpty({ message: 'El campo precio es obligatorio' })
  @IsNumber({}, { message: 'El campo precio debe ser numérico' })
  @IsPositive({ message: 'El campo precio debe ser mayor a 0' })
  readonly precio: number;

  @IsNotEmpty({ message: 'El campo stock es obligatorio' })
  @IsNumber({}, { message: 'El campo stock debe ser numérico' })
  @IsPositive({ message: 'El campo stock debe ser mayor a 0' })
  readonly stock: number;

  @IsOptional()
  @IsString({ message: 'El campo imagen_url debe ser de tipo cadena' })
  @MaxLength(255, { message: 'El campo imagen_url no debe superar los 255 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  readonly imagenUrl?: string;
}
