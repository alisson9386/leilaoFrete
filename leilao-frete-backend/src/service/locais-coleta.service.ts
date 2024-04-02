import { Injectable } from '@nestjs/common';
import { CreateLocaisColetaDto } from '../dto/locais-coleta_dto/create-locais-coleta.dto';
import { UpdateLocaisColetaDto } from '../dto/locais-coleta_dto/update-locais-coleta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocaisColeta } from 'src/entities/locais-coleta.entity';

@Injectable()
export class LocaisColetaService {
  constructor(
    @InjectRepository(LocaisColeta)
    private locaisColetaRepository: Repository<LocaisColeta>,
  ) {}
  create(createLocaisDeColetaDto: CreateLocaisColetaDto) {
    return this.locaisColetaRepository.save(createLocaisDeColetaDto);
  }

  findAll() {
    return this.locaisColetaRepository.find();
  }

  findOne(id: number) {
    return this.locaisColetaRepository.findOneBy({ id: id });
  }

  update(id: number, updateLocaisColetaDto: UpdateLocaisColetaDto) {
    return this.locaisColetaRepository.update(id, updateLocaisColetaDto);
  }

  remove(id: number) {
    return this.locaisColetaRepository.delete(id);
  }
}
