import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { Usuario } from 'src/entities/usuario.entity';
import { UsuariosController } from 'src/controller/usuarios.controller';
import { UsuariosService } from 'src/service/usuarios.service';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [UsuariosController],
  providers: [UsuariosService, JwtService, AuthService],
})
export class UsuariosModule {}
