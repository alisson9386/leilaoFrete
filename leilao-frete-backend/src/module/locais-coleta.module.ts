import { Module } from '@nestjs/common';
import { LocaisColetaService } from '../service/locais-coleta.service';
import { LocaisColetaController } from '../controller/locais-coleta.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocaisColeta } from 'src/entities/locais-coleta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LocaisColeta])],
  controllers: [LocaisColetaController],
  providers: [LocaisColetaService],
})
export class LocaisColetaModule {}
