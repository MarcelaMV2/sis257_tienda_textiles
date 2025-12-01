import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Compra } from './entities/compra.entity';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
import { ProductosService } from 'src/productos/productos.service';

@Injectable()
export class ComprasService {
  constructor(
    @InjectRepository(Compra)
    private readonly comprasRepository: Repository<Compra>,
    private readonly productosService: ProductosService,
  ) {}

  async create(createCompraDto: CreateCompraDto): Promise<Compra> {
    const compra = new Compra();
    Object.assign(compra, createCompraDto);

    // 1) Guardamos la compra
    const compraGuardada = await this.comprasRepository.save(compra);

    // 2) Actualizamos el stock del producto
    await this.productosService.incrementarStock(
      createCompraDto.idProducto,
      createCompraDto.cantidad,
    );

    // 3) Devolvemos la compra guardada
    return compraGuardada;
  }

  async findAll(): Promise<Compra[]> {
    return this.comprasRepository.find({
      relations: { proveedor: true, producto: true },
      select: {
        id: true,
        idProveedor: true,
        idProducto: true,
        cantidad: true,
        precioUnitario: true,
        montoTotal: true,
        fechaCreacion: true,
        proveedor: {
          id: true,
          nombre: true,
        },
        producto: {
          id: true,
          nombre: true,
        },
      },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Compra> {
    const compra = await this.comprasRepository.findOne({
      where: { id },
      relations: { proveedor: true, producto: true },
    });

    if (!compra) {
      throw new NotFoundException('La compra no existe');
    }

    return compra;
  }

  async update(id: number, updateCompraDto: UpdateCompraDto): Promise<Compra> {
    const compra = await this.comprasRepository.findOneBy({ id });
    if (!compra) {
      throw new NotFoundException('La compra no existe');
    }

    Object.assign(compra, updateCompraDto);
    return this.comprasRepository.save(compra);
  }

  async remove(id: number): Promise<Compra> {
    const compra = await this.findOne(id);
    return this.comprasRepository.softRemove(compra);
  }

  async findByProveedor(idProveedor: number): Promise<Compra[]> {
    return this.comprasRepository.find({
      where: { idProveedor },
      relations: { proveedor: true, producto: true },
      order: { id: 'ASC' },
    });
  }

  async findByProducto(idProducto: number): Promise<Compra[]> {
    return this.comprasRepository.find({
      where: { idProducto },
      relations: { proveedor: true, producto: true },
      order: { id: 'ASC' },
    });
  }
}
