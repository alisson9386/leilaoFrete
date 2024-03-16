import { Module } from '@nestjs/common';
import { VeiculoService } from '../service/veiculo.service';
import { VeiculoController } from '../controller/veiculo.controller';

@Module({
  controllers: [VeiculoController],
  providers: [VeiculoService],
})
export class VeiculoModule {}
