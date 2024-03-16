import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProprietarioService } from 'src/service/proprietario.service';
import { WhatsAppService } from '../service/whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
  constructor(
    private readonly whatsappService: WhatsAppService,
    private readonly proprietarioService: ProprietarioService,
    ) {}

  @Get('all')
  async senderAll() {
    var proprietarioService = await this.proprietarioService.findAll();
    let numeros = [];
    proprietarioService.map((freteiro) => {
      if(freteiro.tel_whatsapp) numeros.push(freteiro.tel_whatsapp)
    })
    return this.whatsappService.senderAll(numeros);
  }

  @Get('statusServidor')
  async getStatus() {
    return this.whatsappService.getStatus();
  }

}
