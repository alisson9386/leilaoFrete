import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoUserDto } from './create-tipo-user.dto';

export class UpdateTipoUserDto extends PartialType(CreateTipoUserDto) {}
