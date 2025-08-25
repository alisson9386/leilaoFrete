import { Module } from '@nestjs/common';
import { TipoProprietarioService } from '../service/tipo_proprietario.service';
import { TipoProprietarioController } from '../controller/tipo_proprietario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoProprietario } from 'src/entities/tipo_proprietario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoProprietario])],
  controllers: [TipoProprietarioController],
  providers: [TipoProprietarioService],
})
export class TipoProprietarioModule {}
