import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FreteVeiculoQuantidade } from 'src/entities/frete-veiculo-quantidade.entity';
import { Frete } from 'src/entities/frete.entity';
import { ProdutosLeilao } from 'src/entities/produtos-leilao.entity';
import { Repository } from 'typeorm';
import { ExceptionHandler } from 'winston';
import { UpdateFreteDto } from '../dto/fretes_dto/update-frete.dto';

@Injectable()
export class FretesService {
  constructor(
    @InjectRepository(Frete)
    private freteRepository: Repository<Frete>,
    @InjectRepository(FreteVeiculoQuantidade)
    private freteVeiculoQuantidadeRepository: Repository<FreteVeiculoQuantidade>,
    @InjectRepository(ProdutosLeilao)
    private produtosLeilaoRepository: Repository<ProdutosLeilao>,
  ) {}
  private async insertOrUpdateEntities(
    repository: Repository<any>,
    num_leilao: number,
    entities: any[],
    uniqueKeys: string[],
  ) {
    const existingEntities = await repository.find({ where: { num_leilao } });
    const entitiesToRemove = existingEntities.filter(
      (existingEntity) =>
        !entities.some((entity) =>
          uniqueKeys.every((key) => entity[key] === existingEntity[key]),
        ),
    );

    for (const entityToRemove of entitiesToRemove) {
      await repository.delete(entityToRemove.id);
    }

    for (const entity of entities) {
      const existingRecord = await repository.findOne({
        where: uniqueKeys.reduce(
          (acc, key) => ({ ...acc, [key]: entity[key] }),
          {},
        ),
      });
      if (existingRecord) {
        await repository.update(existingRecord.id, entity);
      } else {
        await repository.save({ ...entity, num_leilao });
      }
    }
    return true;
  }

  async create(
    createFreteDto: any,
    tiposVeiculosFretes: any[],
    produtosFretes: any[],
  ) {
    const result = await this.freteRepository.find({
      order: { id: 'DESC' },
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

    const objeto = await this.freteRepository.save(createFreteDto);

    const save1 = await this.insertOrUpdateEntities(
      this.freteVeiculoQuantidadeRepository,
      createFreteDto.num_leilao,
      tiposVeiculosFretes,
      ['id_tipo_veiculo', 'id_tipo_carroceria'],
    );
    const save2 = await this.insertOrUpdateEntities(
      this.produtosLeilaoRepository,
      createFreteDto.num_leilao,
      produtosFretes,
      ['produto', 'uni_medida'],
    );

    if (save1 && save2) {
      return objeto;
    } else {
      this.freteRepository.delete(objeto.id);
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  async findAll() {
    const fretes = await this.freteRepository.find();
    const fretesComVeiculosEProdutos = await Promise.all(
      fretes.map(async (frete) => {
        const num_leilao = frete.num_leilao;
        const veiculos = await this.freteVeiculoQuantidadeRepository
          .createQueryBuilder('v')
          .where('v.num_leilao = :num_leilao', { num_leilao })
          .getMany();

        const produtos = await this.produtosLeilaoRepository
          .createQueryBuilder('p')
          .where('p.num_leilao = :num_leilao', { num_leilao })
          .getMany();

        return { ...frete, veiculos, produtos };
      }),
    );
    return fretesComVeiculosEProdutos;
  }

  findOne(id: number) {
    return this.freteRepository.findOneBy({ id: id });
  }

  async update(
    id: number,
    updateFreteDto: UpdateFreteDto,
    tiposVeiculosFretes: any[],
    produtosFretes: any[],
  ) {
    if (tiposVeiculosFretes) {
      await this.insertOrUpdateEntities(
        this.freteVeiculoQuantidadeRepository,
        updateFreteDto.num_leilao,
        tiposVeiculosFretes,
        ['id_tipo_veiculo', 'id_tipo_carroceria'],
      );
    }

    if (produtosFretes) {
      await this.insertOrUpdateEntities(
        this.produtosLeilaoRepository,
        updateFreteDto.num_leilao,
        produtosFretes,
        ['produto', 'uni_medida'],
      );
    }

    return this.freteRepository.update(id, updateFreteDto);
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
        await this.freteVeiculoQuantidadeRepository.delete(
          tipoVeiculoParaRemover.id,
        );
      }

      for (const tipoVeiculo of tiposVeiculosFretes) {
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

  updateOne(id: number, updateFreteDto: UpdateFreteDto) {
    return this.freteRepository.update(id, updateFreteDto);
  }

  async insertProdutosFrete(num_leilao: number, produtos: any[]) {
    try {
      const existingProdutos = await this.produtosLeilaoRepository.find({
        where: { num_leilao: num_leilao },
      });

      const produtosParaRemover = existingProdutos.filter(
        (existingTipoVeiculo) =>
          !produtos.some(
            (prod) =>
              prod.produto === existingTipoVeiculo.produto &&
              prod.uni_medida === existingTipoVeiculo.uni_medida,
          ),
      );

      for (const produtoParaRemover of produtosParaRemover) {
        await this.produtosLeilaoRepository.delete(produtoParaRemover.id);
      }

      for (const produto of produtos) {
        const existingRecord = await this.produtosLeilaoRepository.findOne({
          where: {
            num_leilao: produto.num_leilao,
            produto: produto.produto,
            uni_medida: produto.uni_medida,
          },
        });
        if (existingRecord) {
          existingRecord.quantidade = produto.quantidade;
          await this.produtosLeilaoRepository.save(existingRecord);
        } else {
          await this.produtosLeilaoRepository.save(produto);
        }
      }
      return true;
    } catch (err) {
      throw new ExceptionHandler(err);
    }
  }

  async remove(id: number) {
    const frete = await this.freteRepository.findOneBy({ id: id });
    if (!frete) {
      throw new Error('Frete não encontrado');
    }
    const existingProdutos = await this.produtosLeilaoRepository.find({
      where: { num_leilao: frete.num_leilao },
    });
    for (const produtoParaRemover of existingProdutos) {
      await this.produtosLeilaoRepository.delete(produtoParaRemover.id);
    }
    const existingTiposVeiculos =
      await this.freteVeiculoQuantidadeRepository.find({
        where: { num_leilao: frete.num_leilao },
      });
    for (const tipoVeiculoParaRemover of existingTiposVeiculos) {
      await this.freteVeiculoQuantidadeRepository.delete(
        tipoVeiculoParaRemover.id,
      );
    }

    await this.freteRepository.delete(id);

    return { message: 'Frete removido com sucesso' };
  }
}
