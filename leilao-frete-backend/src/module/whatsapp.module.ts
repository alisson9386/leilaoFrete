import { Module } from '@nestjs/common';
import { WhatsAppService } from '../service/whatsapp.service';
import { WhatsappController } from '../controller/whatsapp.controller';
import { FreteirosService } from 'src/service/freteiros.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Whatsapp } from 'src/entities/whatsapp.entity';
import { Freteiro } from 'src/entities/freteiro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Whatsapp, Freteiro])],
  controllers: [WhatsappController],
  providers: [WhatsAppService, FreteirosService],
})
export class WhatsAppModule {}
