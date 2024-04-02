import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, NotFoundException } from '@nestjs/common';
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

  @Get('status/:id')
  async desativarOuAtivar(@Param('id') id: string) {
    try {
      const result = await this.proprietarioService.alterarProprietario(+id);
      return { message: result.message };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { message: error.message, statusCode: HttpStatus.NOT_FOUND };
      } else {
        return {
          message: 'Erro ao deletar',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proprietarioService.deletarProprietario(+id);
  }
}
