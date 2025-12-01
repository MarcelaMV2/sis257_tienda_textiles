import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CarritoProductosService } from './carrito-productos.service';
import { CreateCarritoProductosDto } from './dto/create-carrito-producto.dto';
import { UpdateCarritoProductosDto } from './dto/update-carrito-producto.dto';

@Controller('carrito-productos')
export class CarritoProductosController {
  constructor(private readonly carritoProductosService: CarritoProductosService) {}

  @Post()
  create(@Body() createCarritoProductoDto: CreateCarritoProductosDto) {
    return this.carritoProductosService.create(createCarritoProductoDto);
  }

  @Get()
  findAll() {
    return this.carritoProductosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carritoProductosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCarritoProductoDto: UpdateCarritoProductosDto) {
    return this.carritoProductosService.update(+id, updateCarritoProductoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carritoProductosService.remove(+id);
  }
}
