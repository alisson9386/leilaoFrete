import { Module } from '@nestjs/common';
import { FretesService } from '../service/fretes.service';
import { FretesController } from '../controller/fretes.controller';
import { Frete } from 'src/entities/frete.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreteVeiculoQuantidadeService } from 'src/service/frete-veiculo-quantidade.service';
import { FreteVeiculoQuantidade } from 'src/entities/frete-veiculo-quantidade.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Frete, FreteVeiculoQuantidade])],
  controllers: [FretesController],
  providers: [FretesService, FreteVeiculoQuantidadeService],
})
export class FretesModule {}
