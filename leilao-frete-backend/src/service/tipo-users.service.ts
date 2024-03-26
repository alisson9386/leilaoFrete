import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTipoUserDto } from '../dto/tipouser_dto/create-tipo-user.dto';
import { UpdateTipoUserDto } from '../dto/tipouser_dto/update-tipo-user.dto';
import { TipoUser } from '../entities/tipo-user.entity';

@Injectable()
export class TipoUsersService {
  constructor(
    @InjectRepository(TipoUser)
    private tipoUserRepository: Repository<TipoUser>,
  ) {}
  create(createTipoUserDto: CreateTipoUserDto) {
    return this.tipoUserRepository.save(createTipoUserDto);
  }

  findAll() {
    return this.tipoUserRepository.find();
  }

  findOne(id: number) {
    return this.tipoUserRepository.findOneBy({ id: id });
  }

  update(id: number, updateTipoUserDto: UpdateTipoUserDto) {
    return this.tipoUserRepository.update(id, updateTipoUserDto);
  }

  remove(id: number) {
    return this.tipoUserRepository.delete(id);
  }
}
