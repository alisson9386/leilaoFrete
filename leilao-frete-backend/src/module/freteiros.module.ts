import { Module } from '@nestjs/common';
import { FreteirosService } from '../service/freteiros.service';
import { FreteirosController } from '../controller/freteiros.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Freteiro } from 'src/entities/freteiro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Freteiro])],
  controllers: [FreteirosController],
  providers: [FreteirosService],
})
export class FreteirosModule {}
