import { Injectable } from '@nestjs/common';
import { CreateProdutosLeilaoDto } from '../dto/produtos-leilao_dto/create-produtos-leilao.dto';
import { UpdateProdutosLeilaoDto } from '../dto/produtos-leilao_dto/update-produtos-leilao.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProdutosLeilao } from 'src/entities/produtos-leilao.entity';

@Injectable()
export class ProdutosLeilaoService {
  constructor(
    @InjectRepository(ProdutosLeilao)
    private produtosLeilaoRepository: Repository<ProdutosLeilao>,
  ) {}
  create(createProdutosLeilaoDto: CreateProdutosLeilaoDto) {
    return this.produtosLeilaoRepository.save(createProdutosLeilaoDto);
  }

  findAll() {
    return this.produtosLeilaoRepository.find();
  }

  findOne(id: number) {
    return this.produtosLeilaoRepository.findOneBy({ id: id });
  }

  findByLeilao(numLeilao: number){
    return this.produtosLeilaoRepository.findBy({num_leilao: numLeilao})
  }

  update(id: number, updateProdutosLeilaoDto: UpdateProdutosLeilaoDto) {
    return this.produtosLeilaoRepository.update(id, updateProdutosLeilaoDto);
  }

  remove(id: number) {
    return this.produtosLeilaoRepository.delete(id);
  }
}

