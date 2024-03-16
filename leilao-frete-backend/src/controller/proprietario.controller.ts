import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProprietarioService } from '../service/proprietario.service';
import { CreateProprietarioDto } from '../dto/proprietario_dto/create-proprietario.dto';
import { UpdateProprietarioDto } from '../dto/proprietario_dto/update-proprietario.dto';

@Controller('proprietario')
export class ProprietarioController {
  constructor(private readonly proprietarioService: ProprietarioService) {}

  @Post()
  create(@Body() createProprietarioDto: CreateProprietarioDto) {
    return this.proprietarioService.create(createProprietarioDto);
  }

  @Get()
  findAll() {
    return this.proprietarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proprietarioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFreteiroDto: UpdateProprietarioDto) {
    return this.proprietarioService.update(+id, updateFreteiroDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proprietarioService.desativarProprietario(+id);
  }
}
