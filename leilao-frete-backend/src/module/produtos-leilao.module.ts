import { Module } from '@nestjs/common';
import { ProdutosLeilaoService } from '../service/produtos-leilao.service';
import { ProdutosLeilaoController } from '../controller/produtos-leilao.controller';
import { ProdutosLeilao } from 'src/entities/produtos-leilao.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProdutosLeilao])],
  controllers: [ProdutosLeilaoController],
  providers: [ProdutosLeilaoService],
})
export class ProdutosLeilaoModule {}
