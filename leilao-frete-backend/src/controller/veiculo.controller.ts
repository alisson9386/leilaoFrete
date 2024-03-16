import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VeiculoService } from '../service/veiculo.service';
import { CreateVeiculoDto } from '../dto/veiculo_dto/create-veiculo.dto';
import { UpdateVeiculoDto } from '../dto/veiculo_dto/update-veiculo.dto';

@Controller('veiculo')
export class VeiculoController {
  constructor(private readonly veiculoService: VeiculoService) {}

  @Post()
  create(@Body() createVeiculoDto: CreateVeiculoDto) {
    return this.veiculoService.create(createVeiculoDto);
  }

  @Get()
  findAll() {
    return this.veiculoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.veiculoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVeiculoDto: UpdateVeiculoDto) {
    return this.veiculoService.update(+id, updateVeiculoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.veiculoService.remove(+id);
  }
}
