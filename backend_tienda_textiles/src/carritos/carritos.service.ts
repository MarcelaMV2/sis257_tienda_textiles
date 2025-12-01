import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { UpdateCarritoDto } from './dto/update-carrito.dto';
import { Carrito } from './entities/carrito.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CarritosService {
  constructor(
    @InjectRepository(Carrito)
    private carritoRepository: Repository<Carrito>,
  ) {}

  async create(createCarritoDto: CreateCarritoDto): Promise<Carrito> {
    // Crear una nueva instancia de Carrito con los datos del DTO
    const carrito = new Carrito();
    Object.assign(carrito, createCarritoDto);

    // Guardar en la base de datos y retornar
    return this.carritoRepository.save(carrito);
  }

  async findAll(): Promise<Carrito[]> {
    return this.carritoRepository.find({
      relations: { usuario: true },
      select: {
        id: true,
        estado: true,
        usuario: { id: true, nombre: true, email: true },
      },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Carrito> {
    const lista = await this.carritoRepository.findOne({
      where: { id },
      relations: { usuario: true },
    });
    if (!lista) throw new NotFoundException('El carrito no existe');
    return lista;
  }

  async update(id: number, updateListaDto: UpdateCarritoDto): Promise<Carrito> {
    const lista = await this.findOne(id);
    Object.assign(lista, updateListaDto);

    // si actualizas el usuario, asegúrate de mapearlo correctamente
    if (updateListaDto.idUsuario) {
      lista.idUsuario = updateListaDto.idUsuario;
    }

    return this.carritoRepository.save(lista);
  }

  async remove(id: number): Promise<Carrito> {
    const lista = await this.findOne(id);
    return this.carritoRepository.softRemove(lista);
  }
}
