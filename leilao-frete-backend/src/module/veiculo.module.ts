import { Module } from '@nestjs/common';
import { VeiculoService } from '../service/veiculo.service';
import { VeiculoController } from '../controller/veiculo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Veiculo } from 'src/entities/veiculo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Veiculo])],
  controllers: [VeiculoController],
  providers: [VeiculoService],
})
export class VeiculoModule {}
