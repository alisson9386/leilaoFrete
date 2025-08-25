import { Module } from '@nestjs/common';
import { FreteVeiculoQuantidadeService } from '../service/frete-veiculo-quantidade.service';
import { FreteVeiculoQuantidadeController } from '../controller/frete-veiculo-quantidade.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreteVeiculoQuantidade } from 'src/entities/frete-veiculo-quantidade.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FreteVeiculoQuantidade])],
  controllers: [FreteVeiculoQuantidadeController],
  providers: [FreteVeiculoQuantidadeService],
})
export class FreteVeiculoQuantidadeModule {}
