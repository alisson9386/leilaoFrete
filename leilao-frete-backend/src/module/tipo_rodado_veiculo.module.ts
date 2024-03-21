import { Module } from '@nestjs/common';
import { TipoRodadoVeiculoService } from '../service/tipo_rodado_veiculo.service';
import { TipoRodadoVeiculoController } from '../controller/tipo_rodado_veiculo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoRodadoVeiculo } from 'src/entities/tipo_rodado_veiculo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoRodadoVeiculo])],
  controllers: [TipoRodadoVeiculoController],
  providers: [TipoRodadoVeiculoService],
})
export class TipoRodadoVeiculoModule {}
