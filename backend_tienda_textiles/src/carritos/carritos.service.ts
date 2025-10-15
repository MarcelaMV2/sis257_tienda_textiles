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
    private listasRepository: Repository<Carrito>,
  ) {}

  async create(createListaDto: CreateCarritoDto): Promise<Carrito> {
    // Validar que no exista ya una lista con el mismo nombre para el mismo usuario
    let lista = await this.listasRepository.findOneBy({
      idUsuario: createListaDto.idUsuario, 
    });
    if (lista) throw new ConflictException('La lista de reproducción ya existe');

    lista = new Carrito();
    Object.assign(lista, {
      ...createListaDto,
      idUsuario: createListaDto.idUsuario, 
    });

    return this.listasRepository.save(lista);
  }

  async findAll(): Promise<Carrito[]> {
    return this.listasRepository.find({
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
    const lista = await this.listasRepository.findOne({
      where: { id },
      relations: { usuario: true },
    });
    if (!lista) throw new NotFoundException('La lista de reproducción no existe');
    return lista;
  }

  async update(id: number, updateListaDto: UpdateCarritoDto): Promise<Carrito> {
    const lista = await this.findOne(id);
    Object.assign(lista, updateListaDto);

    // si actualizas el usuario, asegúrate de mapearlo correctamente
    if (updateListaDto.idUsuario) {
      lista.idUsuario = updateListaDto.idUsuario;
    }

    return this.listasRepository.save(lista);
  }

  async remove(id: number): Promise<Carrito> {
    const lista = await this.findOne(id);
    return this.listasRepository.softRemove(lista);
  }
}
