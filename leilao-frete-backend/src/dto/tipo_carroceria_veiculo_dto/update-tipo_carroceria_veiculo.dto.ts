import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoCarroceriaVeiculoDto } from './create-tipo_carroceria_veiculo.dto';

export class UpdateTipoCarroceriaVeiculoDto extends PartialType(CreateTipoCarroceriaVeiculoDto) {}
