import { HttpStatus, Injectable } from '@nestjs/common';
import { Client, ClientOptions, Status } from 'whatsapp-web.js';
import * as QrCode from 'qrcode-terminal';

@Injectable()
export class WhatsAppService {
  private client: Client;
  private qrCodeGenerated: boolean = false;

  constructor() {
    const options: ClientOptions = {

    };
    this.client = new Client(options);
    this.initialize();
  }

  senderAll(variosNumeros: any[]){
    const message = 'Olá! Esta é uma mensagem de teste.';
    variosNumeros.map(async (numero) => {
        await this.client.sendMessage(numero, message);
        console.log('Nova mensagem enviada ao numero: ', numero);
    })
    return HttpStatus.OK;
  }
  

  private initialize() {
    this.client.on('qr', async (qrCode) => {
      if (!this.qrCodeGenerated) {
        // Lógica para exibir o QR code
        QrCode.generate(qrCode, { small: true });
        console.log('QR Code recebido, faça o scan:');
        this.qrCodeGenerated = true;
      }
    });

    this.client.on('ready', () => {
      console.log('Cliente WhatsApp está pronto!');
    });

    this.client.initialize();
  }
}
