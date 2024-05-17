import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLancesFreteDto } from 'src/dto/lances-frete_dto/create-lances-frete.dto';
import { ProdutosLeilao } from 'src/entities/produtos-leilao.entity';
import { Repository } from 'typeorm';
import { Client, ClientOptions } from 'whatsapp-web.js';
import { LoggerService } from './logger.service';
import { LancesFrete } from 'src/entities/lances-frete.entity';

@Injectable()
export class WhatsAppService {
  private client: Client;
  private statusServidor: boolean;
  private qrcode: string;
  private logger: LoggerService;
  private cacheNumeros: Map<number, string[]>;

  constructor(
    @InjectRepository(LancesFrete)
    private lancesFreteRepository: Repository<LancesFrete>,
    private readonly loggerService: LoggerService,
  ) {
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
    await Promise.all(
      variosNumeros.map(async (numero) => {
        await this.client.sendMessage(numero, message);
        this.logger.log('Nova mensagem enviada ao numero: ' + numero);
      }),
    );
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
      if (msg.from === '553192178417@c.us') {
        if (!msg.body.includes(';')) {
          await this.client.sendMessage(
            msg.from,
            'ERRO: A mensagem precisa estar no formato "numero do leilao;valor do lance". Exemplo: "12024;600".',
          );
          return;
        }

        const [numLeilao, valorLance] = msg.body.split(';');

        if (this.cacheNumeros.has(Number(numLeilao))) {
          const numerosParticipantes = this.cacheNumeros.get(Number(numLeilao));

          if (numerosParticipantes.includes(msg.from)) {
            try {
              var createLancesFreteDto = new CreateLancesFreteDto();
              createLancesFreteDto.num_leilao = Number(numLeilao);
              createLancesFreteDto.valor_lance = Number(valorLance);
              createLancesFreteDto.wp_lance = msg.from;
              await this.lancesFreteRepository.save(createLancesFreteDto);
              await this.client.sendMessage(
                msg.from,
                `Seu lance foi registrado para o leilão ${numLeilao} no valor de R$${valorLance}! Aguarde retorno dos resultados.`,
              );
            } catch (error) {
              await this.client.sendMessage(
                msg.from,
                `Erro ao registrar seu lance. Tente novamente dentro de alguns minutos.`,
              );
              this.logger.error(error);
            }
          } else {
            await this.client.sendMessage(
              msg.from,
              `Infelizmente você não está apto para participar do leilão *${numLeilao}*.`,
            );
          }
        } else {
          await this.client.sendMessage(
            msg.from,
            `ERRO: O leilão ${numLeilao} não foi encontrado no cache.`,
          );
        }
      }
      /*const desiredNumber = '553192178417@c.us'; // Número de telefone desejado
      if (msg.from === desiredNumber) {
        this.logger.log(
          `Mensagem recebida do número ${desiredNumber}: ${msg.body}`,
        );
        let location = new Location(48.86214, 2.289971);
        await this.client.sendMessage(msg.from, location);
      }*/
    });

    this.client.initialize();
  }
}
