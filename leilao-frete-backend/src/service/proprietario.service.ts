import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProprietarioDto } from '../dto/proprietario_dto/create-proprietario.dto';
import { UpdateProprietarioDto } from '../dto/proprietario_dto/update-proprietario.dto';
import { Proprietario } from 'src/entities/proprietario.entity';

@Injectable()
export class ProprietarioService {
  constructor(
    @InjectRepository(Proprietario)
    private proprietarioRepository: Repository<Proprietario>,
  ) {}
  create(createProprietarioDto: CreateProprietarioDto) {
    return this.proprietarioRepository.save(createProprietarioDto);
  }

  findAll() {
    return this.proprietarioRepository.find();
  }

  findOne(id: number) {
    return this.proprietarioRepository.findOneBy({id: id});
  }

  update(id: number, updateProprietarioDto: UpdateProprietarioDto) {
    return this.proprietarioRepository.update(id, updateProprietarioDto);
  }

  async desativarProprietario(
    id: number,
  ): Promise<{ success: boolean; message?: string }> {
    const proprietario = await this.proprietarioRepository.findOneBy({ id: id });
    if (proprietario !== null) {
      proprietario.fl_ativo = false;
      await this.proprietarioRepository.save(proprietario);
      return { success: true, message: 'Proprietario desativado com sucesso' };
    } else {
      throw new NotFoundException('Proprietario não encontrado');
    }
  }
}
