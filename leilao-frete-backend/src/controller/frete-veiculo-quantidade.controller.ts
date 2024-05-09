import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FreteVeiculoQuantidadeService } from '../service/frete-veiculo-quantidade.service';
import { CreateFreteVeiculoQuantidadeDto } from '../dto/frete_veiculo_quantidade_dto/create-frete-veiculo-quantidade.dto';
import { UpdateFreteVeiculoQuantidadeDto } from '../dto/frete_veiculo_quantidade_dto/update-frete-veiculo-quantidade.dto';

@Controller('frete-veiculo-quantidade')
export class FreteVeiculoQuantidadeController {
  constructor(private readonly freteVeiculoQuantidadeService: FreteVeiculoQuantidadeService) {}

  @Post()
  create(@Body() createFreteVeiculoQuantidadeDto: CreateFreteVeiculoQuantidadeDto) {
    return this.freteVeiculoQuantidadeService.create(createFreteVeiculoQuantidadeDto);
  }

  @Get()
  findAll() {
    return this.freteVeiculoQuantidadeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.freteVeiculoQuantidadeService.findOne(+id);
  }

  @Get('byLeilao/:numLeilao')
  findAllByLeilao(@Param('numLeilao') numLeilao: number) {
    return this.freteVeiculoQuantidadeService.findAllByLeilao(numLeilao);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFreteVeiculoQuantidadeDto: UpdateFreteVeiculoQuantidadeDto) {
    return this.freteVeiculoQuantidadeService.update(+id, updateFreteVeiculoQuantidadeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.freteVeiculoQuantidadeService.remove(+id);
  }
}
