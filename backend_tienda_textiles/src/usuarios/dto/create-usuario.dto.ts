import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsNotEmpty({ message: 'El campo nombre es obligatorio' })
  @IsString({ message: 'El campo nombre debe ser de tipo cadena' })
  @MaxLength(50, {
    message: 'El campo nombre no debe ser mayor a 50 caracteres',
  })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  readonly nombre: string;

  @IsNotEmpty({ message: 'El campo apellidos es obligatorio' })
  @IsString({ message: 'El campo apellidos debe ser de tipo cadena' })
  @MaxLength(50, {
    message: 'El campo apellidos no debe ser mayor a 50 caracteres',
  })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  readonly apellidos: string;

  @IsNotEmpty({ message: 'El campo email es obligatorio' })
  @IsString({ message: 'El campo email debe ser de tipo cadena' })
  @MaxLength(100, {
    message: 'El campo email no debe ser mayor a 30 caracteres',
  })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  readonly email: string;

  @IsNotEmpty({ message: 'El campo password es obligatorio' })
  @IsString({ message: 'El campo password debe ser de tipo cadena' })
  @MaxLength(30, {
    message: 'El campo password no debe ser mayor a 30 caracteres',
  })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  readonly password: string;

  @IsNotEmpty({ message: 'El campo rol es obligatorio' })
  @IsString({ message: 'El campo rol debe ser de tipo cadena' })
  @MaxLength(20, {
    message: 'El campo rol no debe ser mayor a 30 caracteres',
  })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  readonly rol: string;
}
