import { Module } from '@nestjs/common';
import { TipoProprietarioService } from '../service/tipo_proprietario.service';
import { TipoProprietarioController } from '../controller/tipo_proprietario.controller';

@Module({
  controllers: [TipoProprietarioController],
  providers: [TipoProprietarioService],
})
export class TipoProprietarioModule {}
