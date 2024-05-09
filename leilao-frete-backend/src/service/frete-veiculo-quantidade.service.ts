import { Injectable } from '@nestjs/common';
import { CreateFreteVeiculoQuantidadeDto } from '../dto/frete_veiculo_quantidade_dto/create-frete-veiculo-quantidade.dto';
import { UpdateFreteVeiculoQuantidadeDto } from '../dto/frete_veiculo_quantidade_dto/update-frete-veiculo-quantidade.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FreteVeiculoQuantidade } from 'src/entities/frete-veiculo-quantidade.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FreteVeiculoQuantidadeService {
  constructor(
    @InjectRepository(FreteVeiculoQuantidade)
    private freteVeiculoQuantidadeRepository: Repository<FreteVeiculoQuantidade>,
  ) {}
  create(createFreteVeiculoQuantidadeDto: CreateFreteVeiculoQuantidadeDto) {
    return this.freteVeiculoQuantidadeRepository.save(createFreteVeiculoQuantidadeDto);
  }

  findAll() {
    return this.freteVeiculoQuantidadeRepository.find();
  }

  async findAllByLeilao(num_leilao: number) {
    return await this.freteVeiculoQuantidadeRepository
    .createQueryBuilder('fvq')
    .where('fvq.num_leilao = :num_leilao', { num_leilao })
    .getMany();
  }

  findOne(id: number) {
    return this.freteVeiculoQuantidadeRepository.findOneBy({ id: id });
  }

  update(id: number, updateFreteVeiculoQuantidadeDto: UpdateFreteVeiculoQuantidadeDto) {
    return this.freteVeiculoQuantidadeRepository.update(id, updateFreteVeiculoQuantidadeDto);
  }

  remove(id: number) {
    return this.freteVeiculoQuantidadeRepository.delete(id);
  }
}