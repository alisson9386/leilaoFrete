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
  create(createFreteDto: CreateFreteDto) {
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