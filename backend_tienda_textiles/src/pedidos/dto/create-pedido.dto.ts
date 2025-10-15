import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePedidoDto {
  @IsNotEmpty({ message: 'El campo idUsuario es obligatorio' })
  @IsNumber({}, { message: 'El campo idUsuario debe ser numérico' })
  readonly idUsuario: number;

  @IsNotEmpty({ message: 'El campo total es obligatorio' })
  @IsNumber({}, { message: 'El campo total debe ser numérico' })
  readonly total: number;

  @IsOptional()
  @IsString({ message: 'El campo estado debe ser de tipo cadena' })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  readonly estado?: string;
}
