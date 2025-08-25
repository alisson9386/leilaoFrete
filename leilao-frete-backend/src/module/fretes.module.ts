import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreteVeiculoQuantidade } from 'src/entities/frete-veiculo-quantidade.entity';
import { Frete } from 'src/entities/frete.entity';
import { ProdutosLeilao } from 'src/entities/produtos-leilao.entity';
import { FretesController } from '../controller/fretes.controller';
import { FretesService } from '../service/fretes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Frete, FreteVeiculoQuantidade, ProdutosLeilao])],
  controllers: [FretesController],
  providers: [FretesService],
})
export class FretesModule {}
