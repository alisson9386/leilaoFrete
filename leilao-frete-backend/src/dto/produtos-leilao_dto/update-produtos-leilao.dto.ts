import { PartialType } from '@nestjs/mapped-types';
import { CreateProdutosLeilaoDto } from './create-produtos-leilao.dto';

export class UpdateProdutosLeilaoDto extends PartialType(CreateProdutosLeilaoDto) {}
