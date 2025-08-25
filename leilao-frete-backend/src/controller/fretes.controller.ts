import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  HttpStatus,
} from '@nestjs/common';
import { FretesService } from '../service/fretes.service';
import { CreateFreteDto } from '../dto/fretes_dto/create-frete.dto';
import { UpdateFreteDto } from '../dto/fretes_dto/update-frete.dto';

@Controller('fretes')
export class FretesController {
  constructor(private readonly fretesService: FretesService) {}

  private prepareFreteData(freteDto: CreateFreteDto | UpdateFreteDto) {
    const { tiposVeiculos, produtos, num_leilao } = freteDto;
    var tiposVeiculosFretes: any;
    var produtosFretes: any;
    if(tiposVeiculos){
      tiposVeiculosFretes = tiposVeiculos.map((tipoVeiculo) => ({
        num_leilao,
        id_tipo_veiculo: tipoVeiculo.id,
        id_tipo_carroceria: tipoVeiculo.carroceria.id,
        quantidade: tipoVeiculo.quantidade,
      }));
      delete freteDto.tiposVeiculos;
      delete freteDto.veiculos;
    }

    if(produtos){
      produtosFretes = produtos.map((produto) => ({
        num_leilao,
        produto: produto.produto,
        uni_medida: produto.uni_medida,
        quantidade: produto.quantidade,
      }));
      delete freteDto.produtos;
    }


    return { freteDto, tiposVeiculosFretes, produtosFretes };
  }

  @Post()
  create(@Body() createFreteDto: CreateFreteDto) {
    const { freteDto, tiposVeiculosFretes, produtosFretes } =
      this.prepareFreteData(createFreteDto);
    return this.fretesService.create(
      freteDto,
      tiposVeiculosFretes,
      produtosFretes,
    );
  }

  @Get()
  findAll() {
    return this.fretesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fretesService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateFreteDto: UpdateFreteDto) {
    const { freteDto, tiposVeiculosFretes, produtosFretes } =
      this.prepareFreteData(updateFreteDto);
    return this.fretesService.update(
      +id,
      freteDto,
      tiposVeiculosFretes,
      produtosFretes,
    );
  }

  @Patch(':id')
  updateOne(@Param('id') id: string, @Body() updateFreteDto: UpdateFreteDto) {
    return this.fretesService.updateOne(+id, updateFreteDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.fretesService.remove(+id);
      return { message: 'Frete removido com sucesso', data: result };
    } catch (error) {
      return { message: 'Erro ao remover o frete', error: error.message };
    }
  }
}
