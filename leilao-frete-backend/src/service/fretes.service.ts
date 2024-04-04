import { Injectable } from '@nestjs/common';
import { CreateFreteDto } from '../dto/fretes_dto/create-frete.dto';
import { UpdateFreteDto } from '../dto/fretes_dto/update-frete.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Frete } from 'src/entities/frete.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FretesService {
  constructor(
    @InjectRepository(Frete)
    private freteRepository: Repository<Frete>,
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

  update(id: number, updateFreteDto: UpdateFreteDto) {
    return this.freteRepository.update(id, updateFreteDto);
  }

  remove(id: number) {
    return this.freteRepository.delete(id);
  }
}
