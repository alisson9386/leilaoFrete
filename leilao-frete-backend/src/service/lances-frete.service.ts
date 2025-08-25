import { Injectable } from '@nestjs/common';
import { CreateLancesFreteDto } from '../dto/lances-frete_dto/create-lances-frete.dto';
import { UpdateLancesFreteDto } from '../dto/lances-frete_dto/update-lances-frete.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LancesFrete } from 'src/entities/lances-frete.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LancesFreteService {
  constructor(
    @InjectRepository(LancesFrete)
    private lancesFreteRepository: Repository<LancesFrete>,
  ) {}
  create(createLancesFreteDto: CreateLancesFreteDto) {
    return this.lancesFreteRepository.save(createLancesFreteDto);
  }

  findAll() {
    return this.lancesFreteRepository.find();
  }

  async findAllByLeilao(num_leilao: number) {
    return await this.lancesFreteRepository
    .createQueryBuilder('lf')
    .where('lf.num_leilao = :num_leilao', { num_leilao })
    .getMany();
  }

  findOne(id: number) {
    return this.lancesFreteRepository.findOneBy({ id: id });
  }

  update(id: number, updateLancesFreteDto: UpdateLancesFreteDto) {
    return this.lancesFreteRepository.update(id, updateLancesFreteDto);
  }

  remove(id: number) {
    return this.lancesFreteRepository.delete(id);
  }
}
