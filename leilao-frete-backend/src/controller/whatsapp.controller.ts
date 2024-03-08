import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FreteirosService } from 'src/service/freteiros.service';
import { WhatsAppService } from '../service/whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
  constructor(
    private readonly whatsappService: WhatsAppService,
    private readonly freteirosService: FreteirosService,
    ) {}

  @Get('all')
  async senderAll() {
    var freteiros = await this.freteirosService.findAll();
    let numeros = [];
    freteiros.map((freteiro) => {
      if(freteiro.tel_whatsapp) numeros.push(freteiro.tel_whatsapp)
    })
    return this.whatsappService.senderAll(numeros);
  }

  @Get('statusServidor')
  async getStatus() {
    return this.whatsappService.getStatus();
  }
}
