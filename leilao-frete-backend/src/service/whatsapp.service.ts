import { HttpStatus, Injectable } from '@nestjs/common';
import { Client, ClientOptions, Location } from 'whatsapp-web.js';
import { LoggerService } from './logger.service';

@Injectable()
export class WhatsAppService {
  private client: Client;
  private statusServidor: boolean;
  private qrcode: string;
  private logger: LoggerService;
  private cacheNumeros: Map<number, string[]>;

  constructor(private readonly loggerService: LoggerService) {
    this.logger = loggerService;
    this.cacheNumeros = new Map<number, string[]>();
    const options: ClientOptions = {};
    this.client = new Client(options);
    this.initialize();
    this.qrcode = '';
    this.statusServidor = false;
  }

  async senderAll(variosNumeros: any[], texto: any[], numLeilao: number) {
    const message = texto;
    await Promise.all(variosNumeros.map(async (numero) => {
      await this.client.sendMessage(numero, message);
      this.logger.log('Nova mensagem enviada ao numero: ' + numero);
    }));
    this.addToCache(numLeilao, variosNumeros);
    return HttpStatus.OK;
  }

  private addToCache(numLeilao: number, numeros: string[]) {
    const existingNumbers = this.cacheNumeros.get(numLeilao) || [];
    this.cacheNumeros.set(numLeilao, [...existingNumbers, ...numeros]);
  }

  getNumbersByLeilao(numLeilao: number): string[] {
    return this.cacheNumeros.get(numLeilao) || [];
  }

  getStatus() {
    let data = [this.statusServidor, this.qrcode];
    return data;
  }

  initialize() {
    this.client.on('qr', async (qrCode) => {
      this.qrcode = qrCode;
      //QrCode.generate(qrCode, { small: true });
      //this.logger.log('QR Code recebido, faça o scan:');
    });

    this.client.on('ready', () => {
      this.logger.log('Cliente WhatsApp está pronto!');
      this.statusServidor = true;
    });

    this.client.on('disconnected', () => {
      this.logger.log('Cliente WhatsApp desconectado!');
      this.statusServidor = false;

      setTimeout(() => {
        this.logger.log('Tentando reconectar...');
        this.client.initialize().catch((error) => {
          console.error('Falha ao tentar reconectar:', error);
          this.client.initialize();
        });
      }, 5000);
    });

    this.client.on('message', async (msg) => {
      const desiredNumber = '553192178417@c.us'; // Número de telefone desejado
      if (msg.from === desiredNumber) {
        this.logger.log(
          `Mensagem recebida do número ${desiredNumber}: ${msg.body}`,
        );
        let location = new Location(48.86214, 2.289971);
        await this.client.sendMessage(msg.from, location);
      }
    });

    this.client.initialize();
  }
}
