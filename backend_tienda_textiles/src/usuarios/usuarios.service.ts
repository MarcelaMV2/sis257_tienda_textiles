import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
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

  // Crear usuario con contraseña hasheada y email normalizado
  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const emailNormalizado = createUsuarioDto.email.trim().toLowerCase();
  
    const usuarioExistente = await this.usuariosRepository.findOneBy({
      email: emailNormalizado,
    });
    if (usuarioExistente) {
      throw new ConflictException('El usuario ya existe');
    }
  
    const usuario = this.usuariosRepository.create({
      nombre: createUsuarioDto.nombre,
      apellidos: createUsuarioDto.apellidos,
      email: emailNormalizado,
      telefono: createUsuarioDto.telefono,
      rol: createUsuarioDto.rol,
      clave: createUsuarioDto.clave, // 👀 aquí va en texto plano
    });
    return this.usuariosRepository.save(usuario); // el entity lo hashea automáticamente
  }
  // Validar login con email normalizado y bcrypt.compare
  async validate(email: string, clave: string): Promise<Usuario> {
    const emailNormalizado = email.trim().toLowerCase();

    const usuarioOk = await this.usuariosRepository.findOne({
      where: { email: emailNormalizado },
      select: ['id', 'nombre', 'apellidos', 'email', 'clave', 'rol', 'telefono'],
    });

    if (!usuarioOk) throw new NotFoundException('Usuario inexistente');
    if (emailNormalizado !== usuarioOk.email)
      throw new UnauthorizedException('Email incorrecto');
    const esValida = await bcrypt.compare(clave, usuarioOk.clave);
    if (!esValida) throw new UnauthorizedException('Clave incorrecta');

    return usuarioOk;
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuariosRepository.find();
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOneBy({ id });
    if (!usuario) throw new NotFoundException('El usuario no existe');
    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.findOne(id);
    // Si el DTO trae una clave nueva, la hasheamos y la asignamos a la entidad
    if (updateUsuarioDto.clave) {
      const hash = await bcrypt.hash(updateUsuarioDto.clave, 10);
      usuario.clave = hash; // asignamos el hash directamente a la entidad
    }
    // Asignamos el resto de campos del DTO al usuario
    Object.assign(usuario, updateUsuarioDto);
    return this.usuariosRepository.save(usuario);
  }

  async remove(id: number): Promise<Usuario> {
    const usuario = await this.findOne(id);
    return this.usuariosRepository.softRemove(usuario);
  }
}
