import { Injectable } from '@nestjs/common';
import { CreateTipoRodadoVeiculoDto } from '../dto/tipo_rodado_veiculo_dto/create-tipo_rodado_veiculo.dto';
import { UpdateTipoRodadoVeiculoDto } from '../dto/tipo_rodado_veiculo_dto/update-tipo_rodado_veiculo.dto';
import { TipoRodadoVeiculo } from 'src/entities/tipo_rodado_veiculo.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TipoRodadoVeiculoService {
  constructor(
    @InjectRepository(TipoRodadoVeiculo)
    private tipoRodadoVeiculoRepository: Repository<TipoRodadoVeiculo>,
  ) {}
  create(createTipoRodadoVeiculoDto: CreateTipoRodadoVeiculoDto) {
    return this.tipoRodadoVeiculoRepository.save(createTipoRodadoVeiculoDto);
  }

  findAll() {
    return this.tipoRodadoVeiculoRepository.find();
  }

  findOne(id: number) {
    return this.tipoRodadoVeiculoRepository.findOneBy({ id: id });
  }

  update(id: number, updateTipoRodadoVeiculoDto: UpdateTipoRodadoVeiculoDto) {
    return this.tipoRodadoVeiculoRepository.update(id, updateTipoRodadoVeiculoDto);
  }

  remove(id: number) {
    return this.tipoRodadoVeiculoRepository.delete(id);
  }
}
