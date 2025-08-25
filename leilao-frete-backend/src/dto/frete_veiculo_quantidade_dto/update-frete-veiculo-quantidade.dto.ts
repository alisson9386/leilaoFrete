import { PartialType } from '@nestjs/mapped-types';
import { CreateFreteVeiculoQuantidadeDto } from './create-frete-veiculo-quantidade.dto';

export class UpdateFreteVeiculoQuantidadeDto extends PartialType(CreateFreteVeiculoQuantidadeDto) {}
