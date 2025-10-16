import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido])],
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule {}
