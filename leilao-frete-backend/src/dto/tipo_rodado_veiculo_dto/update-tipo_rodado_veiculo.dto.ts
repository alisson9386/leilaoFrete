import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoRodadoVeiculoDto } from './create-tipo_rodado_veiculo.dto';

export class UpdateTipoRodadoVeiculoDto extends PartialType(CreateTipoRodadoVeiculoDto) {}
