import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo Email no debe ser vacío' })
  @IsString({ message: 'El campo Email debe ser de tipo cadena' })
  @MaxLength(50, { message: 'El campo Email excede los 20 caracteres' })
  @MinLength(4, { message: 'El campo Email es menor a 4 caracteres' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo Clave/Contraseña no debe ser vacío' })
  @IsString({ message: 'El campo Clave/Contraseña debe ser de tipo cadena' })
  clave: string;
}
