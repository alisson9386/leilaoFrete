import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProdutosLeilaoService } from '../service/produtos-leilao.service';
import { CreateProdutosLeilaoDto } from '../dto/produtos-leilao_dto/create-produtos-leilao.dto';
import { UpdateProdutosLeilaoDto } from '../dto/produtos-leilao_dto/update-produtos-leilao.dto';

@Controller('produtos-leilao')
export class ProdutosLeilaoController {
  constructor(private readonly produtosLeilaoService: ProdutosLeilaoService) {}

  @Post()
  create(@Body() createProdutosLeilaoDto: CreateProdutosLeilaoDto) {
    return this.produtosLeilaoService.create(createProdutosLeilaoDto);
  }

  @Get()
  findAll() {
    return this.produtosLeilaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.produtosLeilaoService.findOne(+id);
  }

  @Get('numLeilao/:numLeilao')
  findByLeilao(@Param('numLeilao') numLeilao: number) {
    return this.produtosLeilaoService.findByLeilao(numLeilao);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProdutosLeilaoDto: UpdateProdutosLeilaoDto) {
    return this.produtosLeilaoService.update(+id, updateProdutosLeilaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.produtosLeilaoService.remove(+id);
  }
}
