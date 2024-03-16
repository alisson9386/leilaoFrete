import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoProprietarioService } from '../service/tipo_proprietario.service';
import { CreateTipoProprietarioDto } from '../dto/tipo_proprietario_dto/create-tipo_proprietario.dto';
import { UpdateTipoProprietarioDto } from '../dto/tipo_proprietario_dto/update-tipo_proprietario.dto';

@Controller('tipo-proprietario')
export class TipoProprietarioController {
  constructor(private readonly tipoProprietarioService: TipoProprietarioService) {}

  @Post()
  create(@Body() createTipoProprietarioDto: CreateTipoProprietarioDto) {
    return this.tipoProprietarioService.create(createTipoProprietarioDto);
  }

  @Get()
  findAll() {
    return this.tipoProprietarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoProprietarioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoProprietarioDto: UpdateTipoProprietarioDto) {
    return this.tipoProprietarioService.update(+id, updateTipoProprietarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoProprietarioService.remove(+id);
  }
}
