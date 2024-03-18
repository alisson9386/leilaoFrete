import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from '../dto/login_dto/login.dto';
import { CreateUsuarioDto } from '../dto/usuarios_dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/usuarios_dto/update-usuario.dto';
import { UsuariosService } from '../service/usuarios.service';

@Controller('users')
export class UsuariosController {
  constructor(
    private readonly usersService: UsuariosService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}
  @Post()
  async create(@Body() createUserDto: CreateUsuarioDto) {
    return await this.usersService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.authLogin(loginDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Get('user/:user')
  findUser(@Param('user') user: string) {
    return this.usersService.findUser(user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUsuarioDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.usersService.desactivateUser(+id);
      return { message: result.message };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { message: error.message, statusCode: HttpStatus.NOT_FOUND };
      } else {
        return {
          message: 'Erro ao deletar',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }
    }
  }
}
