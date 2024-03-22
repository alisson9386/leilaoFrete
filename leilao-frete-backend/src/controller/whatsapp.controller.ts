import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProprietarioService } from 'src/service/proprietario.service';
import { WhatsAppService } from '../service/whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
  constructor(
    private readonly whatsappService: WhatsAppService,
    ) {}

  @Get('all')
  async senderAll(data: any) {
    let numeros = [];
    data.map((freteiro: { tel_whatsapp: any; }) => {
      if(freteiro.tel_whatsapp) numeros.push(freteiro.tel_whatsapp)
    })
    return this.whatsappService.senderAll(numeros);
  }

  @Get('statusServidor')
  async getStatus() {
    return this.whatsappService.getStatus();
  }

}
