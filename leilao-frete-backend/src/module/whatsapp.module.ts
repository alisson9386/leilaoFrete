import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LancesFrete } from 'src/entities/lances-frete.entity';
import { LoggerService } from 'src/service/logger.service';
import { WhatsappController } from '../controller/whatsapp.controller';
import { WhatsAppService } from '../service/whatsapp.service';

@Module({
  imports: [TypeOrmModule.forFeature([LancesFrete])],
  controllers: [WhatsappController],
  providers: [WhatsAppService, LoggerService],
})
export class WhatsAppModule {}
