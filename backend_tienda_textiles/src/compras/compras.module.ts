import { Module } from '@nestjs/common';
import { ComprasService } from './compras.service';
import { ComprasController } from './compras.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Compra } from './entities/compra.entity';
import { ProductosModule } from 'src/productos/productos.module';

@Module({
  imports: [TypeOrmModule.forFeature([Compra]), ProductosModule],
  controllers: [ComprasController],
  providers: [ComprasService],
})
export class ComprasModule {}
