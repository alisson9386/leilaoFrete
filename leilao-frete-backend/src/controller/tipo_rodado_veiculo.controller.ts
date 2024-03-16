import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoRodadoVeiculoService } from '../service/tipo_rodado_veiculo.service';
import { CreateTipoRodadoVeiculoDto } from '../dto/tipo_rodado_veiculo_dto/create-tipo_rodado_veiculo.dto';
import { UpdateTipoRodadoVeiculoDto } from '../dto/tipo_rodado_veiculo_dto/update-tipo_rodado_veiculo.dto';

@Controller('tipo-rodado-veiculo')
export class TipoRodadoVeiculoController {
  constructor(private readonly tipoRodadoVeiculoService: TipoRodadoVeiculoService) {}

  @Post()
  create(@Body() createTipoRodadoVeiculoDto: CreateTipoRodadoVeiculoDto) {
    return this.tipoRodadoVeiculoService.create(createTipoRodadoVeiculoDto);
  }

  @Get()
  findAll() {
    return this.tipoRodadoVeiculoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoRodadoVeiculoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoRodadoVeiculoDto: UpdateTipoRodadoVeiculoDto) {
    return this.tipoRodadoVeiculoService.update(+id, updateTipoRodadoVeiculoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoRodadoVeiculoService.remove(+id);
  }
}
