import { PartialType } from '@nestjs/mapped-types';
import { CreateProprietarioDto } from './create-proprietario.dto';

export class UpdateProprietarioDto extends PartialType(CreateProprietarioDto) {}
