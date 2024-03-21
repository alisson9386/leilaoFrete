import { Injectable } from '@nestjs/common';
import { CreateTipoProprietarioDto } from '../dto/tipo_proprietario_dto/create-tipo_proprietario.dto';
import { UpdateTipoProprietarioDto } from '../dto/tipo_proprietario_dto/update-tipo_proprietario.dto';
import { TipoProprietario } from 'src/entities/tipo_proprietario.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TipoProprietarioService {
  constructor(
    @InjectRepository(TipoProprietario)
    private tipoProprietarioRepository: Repository<TipoProprietario>,
  ) {}
  create(createTipoProprietarioDto: CreateTipoProprietarioDto) {
    return this.tipoProprietarioRepository.save(createTipoProprietarioDto);
  }

  findAll() {
    return this.tipoProprietarioRepository.find();
  }

  findOne(id: number) {
    return this.tipoProprietarioRepository.findOneBy({ id: id });
  }

  update(id: number, updateTipoProprietarioDto: UpdateTipoProprietarioDto) {
    return this.tipoProprietarioRepository.update(id, updateTipoProprietarioDto);
  }

  remove(id: number) {
    return this.tipoProprietarioRepository.delete(id);
  }
}
