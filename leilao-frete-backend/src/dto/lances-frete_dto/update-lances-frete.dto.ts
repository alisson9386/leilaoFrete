import { PartialType } from '@nestjs/mapped-types';
import { CreateLancesFreteDto } from './create-lances-frete.dto';

export class UpdateLancesFreteDto extends PartialType(CreateLancesFreteDto) {}
