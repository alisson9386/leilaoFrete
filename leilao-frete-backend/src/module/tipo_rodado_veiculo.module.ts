import { Module } from '@nestjs/common';
import { TipoRodadoVeiculoService } from '../service/tipo_rodado_veiculo.service';
import { TipoRodadoVeiculoController } from '../controller/tipo_rodado_veiculo.controller';

@Module({
  controllers: [TipoRodadoVeiculoController],
  providers: [TipoRodadoVeiculoService],
})
export class TipoRodadoVeiculoModule {}
