import { Module } from '@nestjs/common';
import { CarritoProductosService } from './carrito-productos.service';
import { CarritoProductosController } from './carrito-productos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarritoProductos } from './entities/carrito-producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CarritoProductos])],
  controllers: [CarritoProductosController],
  providers: [CarritoProductosService],
})
export class CarritoProductosModule {}
