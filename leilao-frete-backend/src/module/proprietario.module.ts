import { Module } from '@nestjs/common';
import { ProprietarioService } from '../service/proprietario.service';
import { ProprietarioController } from '../controller/proprietario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proprietario } from 'src/entities/proprietario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Proprietario])],
  controllers: [ProprietarioController],
  providers: [ProprietarioService],
})
export class ProprietarioModule {}
