import { Module } from '@nestjs/common';
import { ProprietarioService } from '../service/proprietario.service';
import { ProprietarioController } from '../controller/proprietario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proprietario } from 'src/entities/proprietario.entity';
import { Veiculo } from 'src/entities/veiculo.entity';
import { VeiculoService } from 'src/service/veiculo.service';

@Module({
  imports: [TypeOrmModule.forFeature([Proprietario, Veiculo])],
  controllers: [ProprietarioController],
  providers: [ProprietarioService,  VeiculoService],
})
export class ProprietarioModule {}
