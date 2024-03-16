import { Injectable } from '@nestjs/common';
import { CreateTipoProprietarioDto } from '../dto/tipo_proprietario_dto/create-tipo_proprietario.dto';
import { UpdateTipoProprietarioDto } from '../dto/tipo_proprietario_dto/update-tipo_proprietario.dto';

@Injectable()
export class TipoProprietarioService {
  create(createTipoProprietarioDto: CreateTipoProprietarioDto) {
    return 'This action adds a new tipoProprietario';
  }

  findAll() {
    return `This action returns all tipoProprietario`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tipoProprietario`;
  }

  update(id: number, updateTipoProprietarioDto: UpdateTipoProprietarioDto) {
    return `This action updates a #${id} tipoProprietario`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipoProprietario`;
  }
}
