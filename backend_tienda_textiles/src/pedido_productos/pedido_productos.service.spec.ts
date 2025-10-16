import { Test, TestingModule } from '@nestjs/testing';
import { PedidoProductosService } from './pedido_productos.service';

describe('PedidoProductosService', () => {
  let service: PedidoProductosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PedidoProductosService],
    }).compile();

    service = module.get<PedidoProductosService>(PedidoProductosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
