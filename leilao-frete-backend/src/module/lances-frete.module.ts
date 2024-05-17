import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LancesFrete } from 'src/entities/lances-frete.entity';
import { LancesFreteController } from '../controller/lances-frete.controller';
import { LancesFreteService } from '../service/lances-frete.service';

@Module({
  imports: [TypeOrmModule.forFeature([LancesFrete])],
  controllers: [LancesFreteController],
  providers: [LancesFreteService],
})
export class LancesFreteModule {}
