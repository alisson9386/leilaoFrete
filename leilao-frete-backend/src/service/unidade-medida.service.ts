import { Injectable } from '@nestjs/common';
import { CreateUnidadeMedidaDto } from '../dto/unidade-medida_dto/create-unidade-medida.dto';
import { UpdateUnidadeMedidaDto } from '../dto/unidade-medida_dto/update-unidade-medida.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UnidadeMedida } from 'src/entities/unidade-medida.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UnidadeMedidaService {
  constructor(
    @InjectRepository(UnidadeMedida)
    private unidadeMedidaRepository: Repository<UnidadeMedida>,
  ) {}
  create(createUnidadeMedidaDto: CreateUnidadeMedidaDto) {
    return this.unidadeMedidaRepository.save(createUnidadeMedidaDto);
  }

  findAll() {
    return this.unidadeMedidaRepository.find();
  }

  findOne(id: number) {
    return this.unidadeMedidaRepository.findOneBy({ id: id });
  }

  update(id: number, updateUnidadeMedidaDto: UpdateUnidadeMedidaDto) {
    return this.unidadeMedidaRepository.update(id, updateUnidadeMedidaDto);
  }

  remove(id: number) {
    return this.unidadeMedidaRepository.delete(id);
  }
}

