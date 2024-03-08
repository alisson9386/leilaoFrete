import { HttpStatus, Injectable } from '@nestjs/common';
import { Client, ClientOptions, Location, Status } from 'whatsapp-web.js';
import * as QrCode from 'qrcode-terminal';

@Injectable()
export class WhatsAppService {
  private client: Client;
  private qrCodeGenerated: boolean = false;
  private statusServidor: boolean = false;

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

  getStatus(){
    return this.statusServidor;
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
      this.statusServidor = true;
    });

    this.client.on('disconnected', () => {
      console.log('Cliente WhatsApp desconectado!');
      this.statusServidor = false; // Emitir evento quando o WhatsApp Web estiver desconectado
    });

    this.client.on('message', async (msg) => {
      // Verificar se a mensagem é do número específico desejado
      const desiredNumber = '553192178417@c.us'; // Número de telefone desejado
      if (msg.from === desiredNumber) {
          console.log(`Mensagem recebida do número ${desiredNumber}: ${msg.body}`);
          let location = new Location(48.862140, 2.289971)
          await this.client.sendMessage(msg.from, location);
      }
  });

    this.client.initialize();
  }
}
