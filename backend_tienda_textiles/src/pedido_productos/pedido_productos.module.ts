import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidoProducto } from './entities/pedido_producto.entity';
import { PedidoProductosService } from './pedido_productos.service';
import { PedidoProductosController } from './pedido_productos.controller';
import { ProductosModule } from 'src/productos/productos.module';

@Module({
  imports: [TypeOrmModule.forFeature([PedidoProducto]), ProductosModule],
  controllers: [PedidoProductosController],
  providers: [PedidoProductosService],
})
export class PedidoProductosModule {}
