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
  async create(createFreteDto: CreateFreteDto, ...tiposVeiculosFretes: any) {
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
      num = num.concat(ano);
      createFreteDto.num_leilao = Number(num);
    } else {
      let num = String(lastLeilao.id + 1);
      num = num.concat(ano);
      createFreteDto.num_leilao = Number(num);
    }
    createFreteDto.num_ordem_coleta = createFreteDto.num_leilao;
    let save = await this.insertTiposVeiculosFrete(createFreteDto.num_leilao, tiposVeiculosFretes);
    if (save) return this.freteRepository.save(createFreteDto);
    else return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  async findAll() {
    const fretes = await this.freteRepository.find();
    const fretesComVeiculos = await Promise.all(
      fretes.map(async (frete) => {
        const num_leilao = frete.num_leilao;
        const veiculos = await this.freteVeiculoQuantidadeRepository
          .createQueryBuilder('v')
          .where('v.num_leilao = :num_leilao', { num_leilao })
          .getMany();

        return { ...frete, veiculos };
      }),
    );
    return fretesComVeiculos;
  }

  findOne(id: number) {
    return this.freteRepository.findOneBy({ id: id });
  }

  async update(
    id: number,
    updateFreteDto: UpdateFreteDto,
    ...tiposVeiculosFretes: any
  ) {
    let save = await this.insertTiposVeiculosFrete(
      updateFreteDto.num_leilao,
      tiposVeiculosFretes,
    );
    if (save) return this.freteRepository.update(id, updateFreteDto);
    else return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  async insertTiposVeiculosFrete(
    num_leilao: number,
    tiposVeiculosFretes: any[],
  ) {
    try {
      const existingTiposVeiculos =
        await this.freteVeiculoQuantidadeRepository.find({
          where: { num_leilao: num_leilao },
        });

      const tiposVeiculosParaRemover = existingTiposVeiculos.filter(
        (existingTipoVeiculo) =>
          !tiposVeiculosFretes.some(
            (tipoVeiculo) =>
              tipoVeiculo.id_tipo_veiculo ===
                existingTipoVeiculo.id_tipo_veiculo &&
              tipoVeiculo.id_tipo_carroceria ===
                existingTipoVeiculo.id_tipo_carroceria,
          ),
      );

      for (const tipoVeiculoParaRemover of tiposVeiculosParaRemover) {
        await this.freteVeiculoQuantidadeRepository.delete(tipoVeiculoParaRemover.id);
      }

      for (const tipoVeiculo of tiposVeiculosFretes[0]) {
        const existingRecord =
          await this.freteVeiculoQuantidadeRepository.findOne({
            where: {
              num_leilao: tipoVeiculo.num_leilao,
              id_tipo_veiculo: tipoVeiculo.id_tipo_veiculo,
              id_tipo_carroceria: tipoVeiculo.id_tipo_carroceria,
            },
          });
        if (existingRecord) {
          existingRecord.quantidade = tipoVeiculo.quantidade;
          await this.freteVeiculoQuantidadeRepository.save(existingRecord);
        } else {
          await this.freteVeiculoQuantidadeRepository.save(tipoVeiculo);
        }
      }
      return true;
    } catch (err) {
      throw new ExceptionHandler(err);
    }
  }

  remove(id: number) {
    return this.freteRepository.delete(id);
  }
}
