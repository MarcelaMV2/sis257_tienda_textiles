import { Module } from '@nestjs/common';
import { CarritosService } from './carritos.service';
import { CarritosController } from './carritos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carrito } from './entities/carrito.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Carrito])],
  controllers: [CarritosController],
  providers: [CarritosService],
})
export class CarritosModule {}
