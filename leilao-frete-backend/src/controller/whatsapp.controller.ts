import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProprietarioService } from 'src/service/proprietario.service';
import { WhatsAppService } from '../service/whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
  constructor(
    private readonly whatsappService: WhatsAppService,
    ) {}

  @Post('all')
  async senderAll(@Body() data: any) {
    let numeros = [];
    data.proprietariosAptos.map((prop: { tel_whatsapp: any; }) => {
      if(prop.tel_whatsapp) numeros.push(prop.tel_whatsapp)
    })
    return this.whatsappService.senderAll(numeros, data.texto, data.numLeilao);
  }

  @Get('statusServidor')
  async getStatus() {
    return this.whatsappService.getStatus();
  }

}
