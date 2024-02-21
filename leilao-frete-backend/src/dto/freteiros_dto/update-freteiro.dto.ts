import { PartialType } from '@nestjs/mapped-types';
import { CreateFreteiroDto } from './create-freteiro.dto';

export class UpdateFreteiroDto extends PartialType(CreateFreteiroDto) {}
