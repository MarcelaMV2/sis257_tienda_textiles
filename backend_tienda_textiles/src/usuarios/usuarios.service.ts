import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    let usuario = await this.usuariosRepository.findOneBy({
      nombre: createUsuarioDto.nombre.trim(),
      email: createUsuarioDto.email.trim(),
    });
    if (usuario) throw new ConflictException('El usuario ya existe');

    usuario = new Usuario();
    Object.assign(usuario, createUsuarioDto);
    return this.usuariosRepository.save(usuario);
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuariosRepository.find();
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOneBy({ id });
    if (!usuario) throw new NotFoundException('El usuario no existe');
    return usuario;
  }

  async update(id: number,updateUsuarioDto: UpdateUsuarioDto,): Promise<Usuario> {
    const usuario = await this.findOne(id);
    Object.assign(usuario, updateUsuarioDto);
    return this.usuariosRepository.save(usuario);
  }

  async remove(id: number): Promise<Usuario> {
    const usuario = await this.findOne(id);
    return this.usuariosRepository.softRemove(usuario);
  }
}
