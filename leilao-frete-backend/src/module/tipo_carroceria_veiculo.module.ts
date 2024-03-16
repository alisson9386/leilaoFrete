import { Module } from '@nestjs/common';
import { TipoCarroceriaVeiculoService } from '../service/tipo_carroceria_veiculo.service';
import { TipoCarroceriaVeiculoController } from '../controller/tipo_carroceria_veiculo.controller';

@Module({
  controllers: [TipoCarroceriaVeiculoController],
  providers: [TipoCarroceriaVeiculoService],
})
export class TipoCarroceriaVeiculoModule {}
