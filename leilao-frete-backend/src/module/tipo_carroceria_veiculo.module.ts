import { Module } from '@nestjs/common';
import { TipoCarroceriaVeiculoService } from '../service/tipo_carroceria_veiculo.service';
import { TipoCarroceriaVeiculoController } from '../controller/tipo_carroceria_veiculo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoCarroceriaVeiculo } from 'src/entities/tipo_carroceria_veiculo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoCarroceriaVeiculo])],
  controllers: [TipoCarroceriaVeiculoController],
  providers: [TipoCarroceriaVeiculoService],
})
export class TipoCarroceriaVeiculoModule {}
