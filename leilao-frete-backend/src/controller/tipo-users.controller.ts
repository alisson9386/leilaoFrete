import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TipoUsersService } from '../service/tipo-users.service';
import { CreateTipoUserDto } from '../dto/tipouser_dto/create-tipo-user.dto';
import { UpdateTipoUserDto } from '../dto/tipouser_dto/update-tipo-user.dto';

@Controller('tipo-users')
export class TipoUsersController {
  constructor(private readonly tipoUsersService: TipoUsersService) {}

  @Post()
  create(@Body() createTipoUserDto: CreateTipoUserDto) {
    return this.tipoUsersService.create(createTipoUserDto);
  }

  @Get()
  findAll() {
    return this.tipoUsersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoUsersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTipoUserDto: UpdateTipoUserDto,
  ) {
    return this.tipoUsersService.update(+id, updateTipoUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoUsersService.remove(+id);
  }
}
