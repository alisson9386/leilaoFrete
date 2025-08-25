import { Injectable } from '@nestjs/common';
import { CreateVeiculoDto } from '../dto/veiculo_dto/create-veiculo.dto';
import { UpdateVeiculoDto } from '../dto/veiculo_dto/update-veiculo.dto';
import { Veiculo } from 'src/entities/veiculo.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class VeiculoService {
  constructor(
    @InjectRepository(Veiculo)
    private veiculoRepository: Repository<Veiculo>,
  ) {}
  create(createVeiculoDto: CreateVeiculoDto) {
    return this.veiculoRepository.save(createVeiculoDto);
  }

  findAll() {
    return this.veiculoRepository.find();
  }

  findAllByProprietario(id: number){
    return this.veiculoRepository
    .createQueryBuilder('v')
    .where('v.id_proprietario= :id', { id })
    .getMany();
  }

  findOne(id: number) {
    return this.veiculoRepository.findOneBy({ id: id });
  }

  update(id: number, updateVeiculoDto: UpdateVeiculoDto) {
    return this.veiculoRepository.update(id, updateVeiculoDto);
  }

  remove(id: number) {
    return this.veiculoRepository.delete(id);
  }
}
