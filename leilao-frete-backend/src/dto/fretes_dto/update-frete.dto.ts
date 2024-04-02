import { PartialType } from '@nestjs/mapped-types';
import { CreateFreteDto } from './create-frete.dto';

export class UpdateFreteDto extends PartialType(CreateFreteDto) {}
