import { Injectable } from '@nestjs/common';
import { CreateUfDto } from '../dto/uf_dto/create-uf.dto';
import { UpdateUfDto } from '../dto/uf_dto/update-uf.dto';

@Injectable()
export class UfService {
  create(createUfDto: CreateUfDto) {
    return 'This action adds a new uf';
  }

  findAll() {
    return `This action returns all uf`;
  }

  findOne(id: number) {
    return `This action returns a #${id} uf`;
  }

  update(id: number, updateUfDto: UpdateUfDto) {
    return `This action updates a #${id} uf`;
  }

  remove(id: number) {
    return `This action removes a #${id} uf`;
  }
}
