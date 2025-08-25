import { Module } from '@nestjs/common';
import { UnidadeMedidaService } from '../service/unidade-medida.service';
import { UnidadeMedidaController } from '../controller/unidade-medida.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnidadeMedida } from 'src/entities/unidade-medida.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UnidadeMedida])],
  controllers: [UnidadeMedidaController],
  providers: [UnidadeMedidaService],
})
export class UnidadeMedidaModule {}
