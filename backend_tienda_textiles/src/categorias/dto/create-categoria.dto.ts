import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

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
}
