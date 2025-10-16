import { Transform } from 'class-transformer';
import { IsDefined, IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCarritoDto {
  @IsNotEmpty({ message: 'El campo estado no debe estar vacío' })
  @IsString({ message: 'El campo estado debe ser de tip cadena' })
  @MaxLength(20, { message: 'El campo estado no debe exceder los 20 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  estado: string;

  @IsDefined({ message: 'El campo id del Usuario debe estar definido' })
  @IsInt({ message: 'El campo id del Usuario debe ser numérico' })
  idUsuario: number;
}
