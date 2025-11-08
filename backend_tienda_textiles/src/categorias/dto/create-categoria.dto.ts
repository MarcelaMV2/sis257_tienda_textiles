import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoriaDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo nombre no debe de estar vacio' })
  @IsString({ message: 'El campo nombre debe de ser una cadena' })
  @MaxLength(200, { message: 'El campo nombre debe de ser menor a 200 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  readonly nombre: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo descripcion no debe de estar vacio' })
  @IsString({ message: 'El campo descripcion debe de ser una cadena' })
  @MaxLength(50, { message: 'El campo descripcion debe de ser menor a 50 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  readonly descripcion: string;

  @IsOptional()
    @IsString({ message: 'El campo imagen_url debe ser de tipo cadena' })
    @MaxLength(500, { message: 'El campo imagen_url no debe superar los 500 caracteres' })
    @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
    readonly imagenUrl?: string;
}
