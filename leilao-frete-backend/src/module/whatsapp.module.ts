import { Module } from '@nestjs/common';
import { WhatsappController } from '../controller/whatsapp.controller';
import { WhatsAppService } from '../service/whatsapp.service';
import { LoggerService } from 'src/service/logger.service';

@Module({
  controllers: [WhatsappController],
  providers: [WhatsAppService, LoggerService],
})
export class WhatsAppModule {}
