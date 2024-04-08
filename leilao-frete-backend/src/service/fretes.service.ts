import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateFreteDto } from '../dto/fretes_dto/create-frete.dto';
import { UpdateFreteDto } from '../dto/fretes_dto/update-frete.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Frete } from 'src/entities/frete.entity';
import { Repository } from 'typeorm';
import { FreteVeiculoQuantidade } from 'src/entities/frete-veiculo-quantidade.entity';
import { ExceptionHandler } from 'winston';

@Injectable()
export class FretesService {
  constructor(
    @InjectRepository(Frete)
    private freteRepository: Repository<Frete>,
    @InjectRepository(FreteVeiculoQuantidade)
    private freteVeiculoQuantidadeRepository: Repository<FreteVeiculoQuantidade>,
  ) {}
  async create(createFreteDto: CreateFreteDto) {
    const result = await this.freteRepository.find({
      order: {
        id: 'DESC',
      },
      take: 1,
    });
    const lastLeilao = result[0];
    let ano = String(new Date().getFullYear());
    if (!lastLeilao) {
      let num = '1';
      num = num.concat(ano)
      createFreteDto.num_leilao = Number(num);
    } else {
      let num = String(lastLeilao.id + 1);
      num = num.concat(ano)
      createFreteDto.num_leilao = Number(num);
    }
    createFreteDto.num_ordem_coleta = createFreteDto.num_leilao;
    return this.freteRepository.save(createFreteDto);
  }

  findAll() {
    return this.freteRepository.find();
  }

  findOne(id: number) {
    return this.freteRepository.findOneBy({ id: id });
  }

  async update(id: number, updateFreteDto: UpdateFreteDto, ...tiposVeiculosFretes: any) {
    let save =  await this.insertTiposVeiculosFrete(tiposVeiculosFretes);
    if(save) return this.freteRepository.update(id, updateFreteDto);
    else return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  async insertTiposVeiculosFrete(tiposVeiculosFretes: any[]) {
    try{
      for (const tipoVeiculo of tiposVeiculosFretes[0]) {
         await this.freteVeiculoQuantidadeRepository.save(tipoVeiculo);
      }
      return true
    }catch (err) {
      throw new ExceptionHandler(err);
      return false;
    }
   }

  remove(id: number) {
    return this.freteRepository.delete(id);
  }
}
