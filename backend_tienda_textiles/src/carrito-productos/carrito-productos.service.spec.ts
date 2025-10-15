import { Test, TestingModule } from '@nestjs/testing';
import { CarritoProductosService } from './carrito-productos.service';

describe('CarritoProductosService', () => {
  let service: CarritoProductosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarritoProductosService],
    }).compile();

    service = module.get<CarritoProductosService>(CarritoProductosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
