import { PartialType } from '@nestjs/mapped-types';
import { CreateLocaisColetaDto } from './create-locais-coleta.dto';

export class UpdateLocaisColetaDto extends PartialType(CreateLocaisColetaDto) {}
