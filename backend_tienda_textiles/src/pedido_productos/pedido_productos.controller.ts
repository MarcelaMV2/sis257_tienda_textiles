import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PedidoProductosService } from './pedido_productos.service';
import { CreatePedidoProductoDto } from './dto/create-pedido_producto.dto';
import { UpdatePedidoProductoDto } from './dto/update-pedido_producto.dto';

@Controller('pedido-productos')
export class PedidoProductosController {
  constructor(private readonly pedidoProductosService: PedidoProductosService) {}

  @Post()
  create(@Body() dto: CreatePedidoProductoDto) {
    return this.pedidoProductosService.create(dto);
  }

  @Get()
  findAll() {
    return this.pedidoProductosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pedidoProductosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePedidoProductoDto) {
    return this.pedidoProductosService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pedidoProductosService.remove(+id);
  }
}
