import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioDto } from '../dto/usuarios_dto/create-usuario.dto'
import { UpdateUsuarioDto } from '../dto/usuarios_dto/update-usuario.dto';
import * as bcrypt from 'bcryptjs';
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private userRepository: Repository<Usuario>,
  ) {}
  async create(createUserDto: CreateUsuarioDto) {
    createUserDto.senha = await bcrypt.hash(createUserDto.senha, 10);
    return this.userRepository.save(createUserDto);
  }

  findAll() {
    return this.userRepository.find({
      where: {
      fl_ativo: true
    }
    });
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id: id });
  }

  findUser(user: string) {
    return this.userRepository.findOneBy({ usuario: user });
  }

  async update(id: number, updateUserDto: UpdateUsuarioDto) {
    if (updateUserDto.senha && updateUserDto.senha != '') {
      updateUserDto.senha = await bcrypt.hash(updateUserDto.senha, 10);
    } else if (updateUserDto.senha == '') {
      delete updateUserDto.senha;
    }
    return this.userRepository.update(id, updateUserDto);
  }

  async desactivateUser(
    id: number,
  ): Promise<{ success: boolean; message?: string }> {
    const user = await this.userRepository.findOneBy({ id: id });
    if (user !== null) {
      user.fl_ativo = false;
      await this.userRepository.save(user);
      return { success: true, message: 'Usuário desativado com sucesso' };
    } else {
      throw new NotFoundException('Usuário não encontrado');
    }
  }

  async validateUser(usuario: string, senha: string) {
    const user = await this.userRepository.findOneBy({ usuario: usuario });

    if (user && (await bcrypt.compare(senha, user.senha))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { senha, ...result } = user;
      return result;
    }

    return null;
  }
}
