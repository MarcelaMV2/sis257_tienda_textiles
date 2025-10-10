import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    let producto = await this.productosRepository.findOneBy({
      idCategoria: createProductoDto.idCategoria,
      nombre: createProductoDto.nombre,
    });
    if (producto) throw new ConflictException('El producto ya existe');

    producto = new Producto();
    Object.assign(producto, createProductoDto);
    return this.productosRepository.save(producto);
  }

  async findAll(parametro?: string): Promise<Producto[]> {
    return this.productosRepository.find({
      where: { nombre: ILike(`%${parametro ?? ''}%`) },
      select: {
        id: true,
        idCategoria: true,
        nombre: true,
        descripcion: true,
        precio: true,
        stock: true,
        imagenUrl: true,
      },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productosRepository.findOne({
      where: { id },
      relations: { categoria: true },
    });
    if (!producto) throw new NotFoundException('El producto no existe');
    return producto;
  }

  async findByCategoria(idCategoria: number): Promise<Producto[]> {
    return await this.productosRepository.find({
      where: { idCategoria },
      order: { nombre: 'ASC' },
    });
  }

  async update(id: number, updateProductoDto: UpdateProductoDto): Promise<Producto> {
    const producto = await this.findOne(id);
    Object.assign(producto, updateProductoDto);
    return this.productosRepository.save(producto);
  }

  async remove(id: number): Promise<Producto> {
    const producto = await this.findOne(id);
    return this.productosRepository.softRemove(producto);
  }
}
