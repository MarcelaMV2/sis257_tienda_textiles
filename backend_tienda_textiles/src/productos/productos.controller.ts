import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

  @Get()
  findAll(@Query('q') terminoBusqueda?: string) {
    // <-- 👈 AQUÍ ESTÁ EL CAMBIO CLAVE
    // NestJS mapea ?q=valor al parámetro terminoBusqueda
    // Pasamos el término de búsqueda (que puede ser undefined) al servicio
    return this.productosService.findAll(terminoBusqueda);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productosService.update(+id, updateProductoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productosService.remove(+id);
  }

  @Get('categoria/:id')
  async obtenerPorCategoria(@Param('id') id: string) {
    return await this.productosService.obtenerPorCategoria(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productosService.findOne(+id);
  }
}
