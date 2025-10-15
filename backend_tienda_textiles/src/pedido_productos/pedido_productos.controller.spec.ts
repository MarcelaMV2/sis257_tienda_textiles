import { Test, TestingModule } from '@nestjs/testing';
import { PedidoProductosController } from './pedido_productos.controller';
import { PedidoProductosService } from './pedido_productos.service';

describe('PedidoProductosController', () => {
  let controller: PedidoProductosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PedidoProductosController],
      providers: [PedidoProductosService],
    }).compile();

    controller = module.get<PedidoProductosController>(PedidoProductosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
