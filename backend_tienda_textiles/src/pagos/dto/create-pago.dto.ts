import { IsNotEmpty, IsNumber, IsString, IsPositive, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePagoDto {
  @IsNotEmpty({ message: 'El campo id_pedido es obligatorio' })
  @IsNumber({}, { message: 'El campo id_pedido debe ser numérico' })
  readonly idPedido: number;

  @IsNotEmpty({ message: 'El campo metodo es obligatorio' })
  @IsString({ message: 'El campo metodo debe ser de tipo cadena' })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  readonly metodo: string;

  @IsNotEmpty({ message: 'El campo monto es obligatorio' })
  @IsNumber({}, { message: 'El campo monto debe ser numérico' })
  @IsPositive({ message: 'El monto debe ser mayor a 0' })
  readonly monto: number;

  @IsOptional()
  @IsString({ message: 'El campo estado debe ser de tipo cadena' })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  readonly estado?: string;
}
