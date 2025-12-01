import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseIntPipe,
  ForbiddenException,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PickType } from '@nestjs/mapped-types';
import { IsIn, IsString } from 'class-validator';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

// Derivado del existente, pero SOLO con 'estado'
class UpdateEstadoPedidoDto {
  @IsString({ message: 'El estado es obligatorio' })
  @IsIn(['pendiente', 'entregado', 'cancelado'], {
    message: 'Estado inválido',
  })
  estado!: string;
}

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidosService.create(createPedidoDto);
  }

  @Post(':id/enviar-correo')
  enviarCorreo(@Param('id') id: string) {
    return this.pedidosService.enviarCorreoConfirmacion(+id);
  }

  @Get()
  findAll() {
    return this.pedidosService.findAll();
  }

  /* @UseGuards(AuthGuard('jwt'))
  @Get('mios')
  async misPedidos(@Req() req) {
    // req.user.sub viene del JWT
    return this.pedidosService.findByUser(req.user.sub);
  } */

  // IMPORTANTE: usa JwtAuthGuard en vez de AuthGuard('jwt') para que respete @Public()
  @UseGuards(AuthGuard('jwt'))
  @Get('mios')
  async misPedidos(@Req() req) {
    console.log('req.user en /pedidos/mios =>', req.user); // para ver qué llega

    // OJO: JwtStrategy.validate devuelve un Usuario completo
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('No se pudo obtener el ID del usuario');
    }

    return this.pedidosService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pedidosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePedidoDto: UpdatePedidoDto) {
    return this.pedidosService.update(+id, updatePedidoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pedidosService.remove(+id);
  }

  @Patch(':id/estado')
  @UseGuards(AuthGuard('jwt')) // Protege esta ruta con el guard de JWT
  async cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEstadoPedidoDto,
    @Req() req,
  ) {
    if (!req.user) throw new UnauthorizedException(); // Verifica que haya un usuario
    if (req.user.rol !== 'admin') throw new ForbiddenException('Solo admin puede cambiar estado'); // Verifica que sea admin

    return this.pedidosService.cambiarEstado(id, dto.estado);
  }
}
