import { Module } from '@nestjs/common';
import { WhatsAppService } from '../service/whatsapp.service';
import { WhatsappController } from '../controller/whatsapp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proprietario } from 'src/entities/proprietario.entity';
import { ProprietarioService } from 'src/service/proprietario.service';

@Module({
  controllers: [WhatsappController],
  providers: [WhatsAppService, ProprietarioService],
})
export class WhatsAppModule {}
