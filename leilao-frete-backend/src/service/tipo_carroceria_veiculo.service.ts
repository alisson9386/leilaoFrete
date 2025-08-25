import { Injectable } from '@nestjs/common';
import { CreateTipoCarroceriaVeiculoDto } from '../dto/tipo_carroceria_veiculo_dto/create-tipo_carroceria_veiculo.dto';
import { UpdateTipoCarroceriaVeiculoDto } from '../dto/tipo_carroceria_veiculo_dto/update-tipo_carroceria_veiculo.dto';
import { TipoCarroceriaVeiculo } from 'src/entities/tipo_carroceria_veiculo.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TipoCarroceriaVeiculoService {
  constructor(
    @InjectRepository(TipoCarroceriaVeiculo)
    private tipoCarroceriaVeiculoRepository: Repository<TipoCarroceriaVeiculo>,
  ) {}
  create(createTipoCarroceriaVeiculoDto: CreateTipoCarroceriaVeiculoDto) {
    return this.tipoCarroceriaVeiculoRepository.save(createTipoCarroceriaVeiculoDto);
  }

  findAll() {
    return this.tipoCarroceriaVeiculoRepository.find();
  }

  findOne(id: number) {
    return this.tipoCarroceriaVeiculoRepository.findOneBy({ id: id });
  }

  update(id: number, updateTipoCarroceriaVeiculoDto: UpdateTipoCarroceriaVeiculoDto) {
    return this.tipoCarroceriaVeiculoRepository.update(id, updateTipoCarroceriaVeiculoDto);
  }

  remove(id: number) {
    return this.tipoCarroceriaVeiculoRepository.delete(id);
  }
}
