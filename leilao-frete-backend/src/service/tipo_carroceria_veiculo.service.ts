import { Injectable } from '@nestjs/common';
import { CreateTipoCarroceriaVeiculoDto } from '../dto/tipo_carroceria_veiculo_dto/create-tipo_carroceria_veiculo.dto';
import { UpdateTipoCarroceriaVeiculoDto } from '../dto/tipo_carroceria_veiculo_dto/update-tipo_carroceria_veiculo.dto';

@Injectable()
export class TipoCarroceriaVeiculoService {
  create(createTipoCarroceriaVeiculoDto: CreateTipoCarroceriaVeiculoDto) {
    return 'This action adds a new tipoCarroceriaVeiculo';
  }

  findAll() {
    return `This action returns all tipoCarroceriaVeiculo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tipoCarroceriaVeiculo`;
  }

  update(id: number, updateTipoCarroceriaVeiculoDto: UpdateTipoCarroceriaVeiculoDto) {
    return `This action updates a #${id} tipoCarroceriaVeiculo`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipoCarroceriaVeiculo`;
  }
}
