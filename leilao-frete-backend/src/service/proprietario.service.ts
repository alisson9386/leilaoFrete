import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateProprietarioDto } from '../dto/proprietario_dto/create-proprietario.dto';
import { UpdateProprietarioDto } from '../dto/proprietario_dto/update-proprietario.dto';
import { Proprietario } from 'src/entities/proprietario.entity';
import { Veiculo } from 'src/entities/veiculo.entity';

@Injectable()
export class ProprietarioService {
  constructor(
    @InjectRepository(Proprietario)
    private proprietarioRepository: Repository<Proprietario>,
    @InjectRepository(Veiculo)
    private veiculoRepository: Repository<Veiculo>,
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

  async porVeiculos(veiculos: any){
    var rodados = veiculos.veiculosFind;
    var carrocerias = veiculos.carroceriasFind;
    const veiculosProp =  await this.veiculoRepository
    .createQueryBuilder('v')
    .select('v.id_proprietario')
    .where('v.tipo_rodado IN (:rodados)', { rodados })
    .andWhere('v.tipo_carroceria IN (:carrocerias)', { carrocerias })
    .getMany();

    var ids = [];
    veiculosProp.map((vp) =>{ ids.push(vp.id_proprietario)});

    const proprietarios = await this.proprietarioRepository.findBy({ id: In(ids), fl_ativo: true });

    return proprietarios
  }

  update(id: number, updateProprietarioDto: UpdateProprietarioDto) {
    return this.proprietarioRepository.update(id, updateProprietarioDto);
  }

  async alterarProprietario(
    id: number,
  ): Promise<{ success: boolean; message?: string }> {
    const user = await this.proprietarioRepository.findOneBy({ id: id });
    if (user !== null) {
      user.fl_ativo = user.fl_ativo ? false : true;
      await this.proprietarioRepository.save(user);
      return { success: true, message: 'Proprietário alterado com sucesso' };
    } else {
      throw new NotFoundException('Proprietário não encontrado');
    }
  }

  async deletarProprietario(id: number){
      await this.proprietarioRepository.delete(id);
      return { success: true, message: 'Proprietario deletado com sucesso' };
  }
}
