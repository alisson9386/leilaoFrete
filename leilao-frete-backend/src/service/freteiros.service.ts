import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFreteiroDto } from '../dto/freteiros_dto/create-freteiro.dto';
import { UpdateFreteiroDto } from '../dto/freteiros_dto/update-freteiro.dto';
import { Freteiro } from 'src/entities/freteiro.entity';

@Injectable()
export class FreteirosService {
  constructor(
    @InjectRepository(Freteiro)
    private freteiroRepository: Repository<Freteiro>,
  ) {}
  create(createFreteiroDto: CreateFreteiroDto) {
    return this.freteiroRepository.save(createFreteiroDto);
  }

  findAll() {
    return this.freteiroRepository.find();
  }

  findOne(id: number) {
    return this.freteiroRepository.findOneBy({id: id});
  }

  update(id: number, updateFreteiroDto: UpdateFreteiroDto) {
    return this.freteiroRepository.update(id, updateFreteiroDto);
  }

  async desativarFreteiro(
    id: number,
  ): Promise<{ success: boolean; message?: string }> {
    const freteiro = await this.freteiroRepository.findOneBy({ id: id });
    if (freteiro !== null) {
      freteiro.fl_ativo = false;
      await this.freteiroRepository.save(freteiro);
      return { success: true, message: 'Freteiro desativado com sucesso' };
    } else {
      throw new NotFoundException('Freteiro não encontrado');
    }
  }
}
