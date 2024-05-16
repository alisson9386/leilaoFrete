import { Module } from '@nestjs/common';
import { LancesFreteService } from '../service/lances-frete.service';
import { LancesFreteController } from '../controller/lances-frete.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LancesFrete } from 'src/entities/lances-frete.entity';
import { WhatsAppService } from 'src/service/whatsapp.service';

@Module({
  imports: [TypeOrmModule.forFeature([LancesFrete])],
  controllers: [LancesFreteController],
  providers: [LancesFreteService],
})
export class LancesFreteModule {}
