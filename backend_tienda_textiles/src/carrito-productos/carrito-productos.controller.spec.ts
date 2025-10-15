import { Test, TestingModule } from '@nestjs/testing';
import { CarritoProductosController } from './carrito-productos.controller';
import { CarritoProductosService } from './carrito-productos.service';

describe('CarritoProductosController', () => {
  let controller: CarritoProductosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarritoProductosController],
      providers: [CarritoProductosService],
    }).compile();

    controller = module.get<CarritoProductosController>(CarritoProductosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
