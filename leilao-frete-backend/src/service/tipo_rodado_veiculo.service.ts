import { Injectable } from '@nestjs/common';
import { CreateTipoRodadoVeiculoDto } from '../dto/tipo_rodado_veiculo_dto/create-tipo_rodado_veiculo.dto';
import { UpdateTipoRodadoVeiculoDto } from '../dto/tipo_rodado_veiculo_dto/update-tipo_rodado_veiculo.dto';

@Injectable()
export class TipoRodadoVeiculoService {
  create(createTipoRodadoVeiculoDto: CreateTipoRodadoVeiculoDto) {
    return 'This action adds a new tipoRodadoVeiculo';
  }

  findAll() {
    return `This action returns all tipoRodadoVeiculo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tipoRodadoVeiculo`;
  }

  update(id: number, updateTipoRodadoVeiculoDto: UpdateTipoRodadoVeiculoDto) {
    return `This action updates a #${id} tipoRodadoVeiculo`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipoRodadoVeiculo`;
  }
}
