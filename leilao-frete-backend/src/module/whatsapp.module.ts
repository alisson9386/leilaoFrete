import { Module } from '@nestjs/common';
import { WhatsappController } from '../controller/whatsapp.controller';
import { WhatsAppService } from '../service/whatsapp.service';
import { LoggerService } from 'src/service/logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LancesFrete } from 'src/entities/lances-frete.entity';
import { LancesFreteService } from 'src/service/lances-frete.service';

@Module({
  imports: [TypeOrmModule.forFeature([LancesFrete])],
  controllers: [WhatsappController],
  providers: [WhatsAppService, LoggerService],
})
export class WhatsAppModule {}
