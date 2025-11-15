import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  // src/auth/auth.service.ts
  async login(authLoginDto: AuthLoginDto): Promise<any> {
    const { email, clave } = authLoginDto;
    const usuarioOk = await this.usuarioService.validate(email, clave);

    // ⬇️ incluir rol (y email) en el JWT
    const payload = { sub: usuarioOk.id, rol: usuarioOk.rol, email: usuarioOk.email };
    const access_token = await this.getAccessToken(payload);

    // ⬇️ no devuelvas 'clave'
    const usuarioSafe = {
      id: usuarioOk.id,
      nombre: usuarioOk.nombre,
      apellidos: usuarioOk.apellidos,
      email: usuarioOk.email,
      telefono: usuarioOk.telefono,
      rol: usuarioOk.rol,
    };

    return { ...usuarioSafe, access_token };
  }

  async getAccessToken(payload: JwtPayload) {
    type StringValue = `${number}s`;
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_TOKEN,
      expiresIn: process.env.JWT_TOKEN_EXPIRATION as StringValue,
    });
    return accessToken;
  }

  async verifyPayload(payload: JwtPayload): Promise<Usuario> {
    let usuario: Usuario;

    try {
      usuario = await this.usuarioService.findOne(payload.sub);
    } catch {
      throw new UnauthorizedException(`Usuario inválido: ${payload.sub}`);
    }

    return usuario;
  }
}
