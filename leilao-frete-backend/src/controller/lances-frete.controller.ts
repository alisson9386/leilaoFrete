import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LancesFreteService } from '../service/lances-frete.service';
import { CreateLancesFreteDto } from '../dto/lances-frete_dto/create-lances-frete.dto';
import { UpdateLancesFreteDto } from '../dto/lances-frete_dto/update-lances-frete.dto';

@Controller('lances-frete')
export class LancesFreteController {
  constructor(private readonly lancesFreteService: LancesFreteService) {}

  @Post()
  create(@Body() createLancesFreteDto: CreateLancesFreteDto) {
    return this.lancesFreteService.create(createLancesFreteDto);
  }

  @Get()
  findAll() {
    return this.lancesFreteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lancesFreteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLancesFreteDto: UpdateLancesFreteDto) {
    return this.lancesFreteService.update(+id, updateLancesFreteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lancesFreteService.remove(+id);
  }
}
