import { Module } from '@nestjs/common';
import { WhatsappController } from '../controller/whatsapp.controller';
import { WhatsAppService } from '../service/whatsapp.service';

@Module({
  controllers: [WhatsappController],
  providers: [WhatsAppService],
})
export class WhatsAppModule {}
