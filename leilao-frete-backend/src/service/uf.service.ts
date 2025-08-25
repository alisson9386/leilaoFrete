import { Injectable } from '@nestjs/common';
import { CreateUfDto } from '../dto/uf_dto/create-uf.dto';
import { UpdateUfDto } from '../dto/uf_dto/update-uf.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Uf } from 'src/entities/uf.entity';

@Injectable()
export class UfService {
  constructor(
    @InjectRepository(Uf)
    private ufRepository: Repository<Uf>,
  ) {}
  create(createUfDto: CreateUfDto) {
    return this.ufRepository.save(createUfDto);
  }

  findAll() {
    return this.ufRepository.find();
  }

  findOne(id: number) {
    return this.ufRepository.findOneBy({ id: id });
  }

  update(id: number, upUfdateDto: UpdateUfDto) {
    return this.ufRepository.update(id, upUfdateDto);
  }

  remove(id: number) {
    return this.ufRepository.delete(id);
  }
}
