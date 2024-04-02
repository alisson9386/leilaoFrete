import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FretesService } from '../service/fretes.service';
import { CreateFreteDto } from '../dto/fretes_dto/create-frete.dto';
import { UpdateFreteDto } from '../dto/fretes_dto/update-frete.dto';

@Controller('fretes')
export class FretesController {
  constructor(private readonly fretesService: FretesService) {}

  @Post()
  create(@Body() createFreteDto: CreateFreteDto) {
    return this.fretesService.create(createFreteDto);
  }

  @Get()
  findAll() {
    return this.fretesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fretesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFreteDto: UpdateFreteDto) {
    return this.fretesService.update(+id, updateFreteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fretesService.remove(+id);
  }
}
