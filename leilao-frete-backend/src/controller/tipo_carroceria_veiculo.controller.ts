import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoCarroceriaVeiculoService } from '../service/tipo_carroceria_veiculo.service';
import { CreateTipoCarroceriaVeiculoDto } from '../dto/tipo_carroceria_veiculo_dto/create-tipo_carroceria_veiculo.dto';
import { UpdateTipoCarroceriaVeiculoDto } from '../dto/tipo_carroceria_veiculo_dto/update-tipo_carroceria_veiculo.dto';

@Controller('tipo-carroceria-veiculo')
export class TipoCarroceriaVeiculoController {
  constructor(private readonly tipoCarroceriaVeiculoService: TipoCarroceriaVeiculoService) {}

  @Post()
  create(@Body() createTipoCarroceriaVeiculoDto: CreateTipoCarroceriaVeiculoDto) {
    return this.tipoCarroceriaVeiculoService.create(createTipoCarroceriaVeiculoDto);
  }

  @Get()
  findAll() {
    return this.tipoCarroceriaVeiculoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoCarroceriaVeiculoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoCarroceriaVeiculoDto: UpdateTipoCarroceriaVeiculoDto) {
    return this.tipoCarroceriaVeiculoService.update(+id, updateTipoCarroceriaVeiculoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoCarroceriaVeiculoService.remove(+id);
  }
}
