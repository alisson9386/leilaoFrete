import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoProprietarioDto } from './create-tipo_proprietario.dto';

export class UpdateTipoProprietarioDto extends PartialType(CreateTipoProprietarioDto) {}
