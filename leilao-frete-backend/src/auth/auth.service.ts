import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../service/usuarios.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async authLogin(loginDto) {
    const authenticatedUser = await this.usuariosService.validateUser(
      loginDto.usuario,
      loginDto.senha,
    );
    if (!authenticatedUser) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Usuário ou senha inválidos',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const payload = { user: authenticatedUser, id: authenticatedUser.id };
    const secretKey = {
      secret: 'zaq12wsxZAQ!@WSXZ0rr0b@tmak',
      expiresIn: '6h',
    };
    return {
      token: this.jwtService.sign(payload, secretKey),
    };
  }
}
