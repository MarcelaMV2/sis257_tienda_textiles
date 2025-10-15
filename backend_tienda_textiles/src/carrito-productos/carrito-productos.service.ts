import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCarritoProductosDto } from './dto/update-carrito-producto.dto';
import { CreateCarritoProductosDto } from './dto/create-carrito-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CarritoProductos } from './entities/carrito-producto.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CarritoProductosService {
  constructor(
    @InjectRepository(CarritoProductos)
    private carritoProductosRepository: Repository<CarritoProductos>,
  ) {}

  async create(createCarritoProductoDto: CreateCarritoProductosDto): Promise<CarritoProductos> {
    const carritoProducto = new CarritoProductos();

    // Copia directamente todas las propiedades del DTO a la entidad
    Object.assign(carritoProducto, createCarritoProductoDto);

    // Guarda en la base de datos
    return this.carritoProductosRepository.save(carritoProducto);
  }

  async findAll(): Promise<CarritoProductos[]> {
    return this.carritoProductosRepository.find({
      relations: {
        producto: true, // relación con Producto
        carrito: true, // relación con Carrito
      },
      select: {
        id: true,
        cantidad: true,
        producto: { id: true, nombre: true, precio: true }, // campos del producto que quieres exponer
        carrito: { id: true, idUsuario: true, estado: true }, // campos del carrito que quieres exponer
      },
      order: {
        id: 'ASC', // o cualquier otro campo
      },
    });
  }

  async findOne(id: number): Promise<CarritoProductos> {
    const carritoProductos = await this.carritoProductosRepository.findOne({
      where: { id },
      relations: {
        producto: true, // relación con Producto
        carrito: true, // relación con Carrito
      },
    });

    if (!carritoProductos) throw new NotFoundException('El producto en el carrito no existe');

    return carritoProductos;
  }

  async update(
    id: number,
    updateCarritoProductoDto: UpdateCarritoProductosDto,
  ): Promise<CarritoProductos> {
    // Buscar el registro existente
    const carritoProducto = await this.findOne(id);

    // Actualizar los campos con los datos del DTO
    Object.assign(carritoProducto, updateCarritoProductoDto);

    // Si actualizas idProducto o idCarrito explícitamente, asegúrate de asignarlos
    if (updateCarritoProductoDto.idProducto !== undefined) {
      carritoProducto.idProducto = updateCarritoProductoDto.idProducto;
    }

    if (updateCarritoProductoDto.idCarrito !== undefined) {
      carritoProducto.idCarrito = updateCarritoProductoDto.idCarrito;
    }

    // Guardar los cambios en la base de datos
    return this.carritoProductosRepository.save(carritoProducto);
  }

  async remove(id: number): Promise<CarritoProductos> {
    // Buscar el registro existente
    const carritoProductos = await this.findOne(id);

    // Soft remove: marca el registro como eliminado sin borrarlo físicamente
    return this.carritoProductosRepository.softRemove(carritoProductos);
  }
}
