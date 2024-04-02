import { Module } from '@nestjs/common';
import { FretesService } from '../service/fretes.service';
import { FretesController } from '../controller/fretes.controller';
import { Frete } from 'src/entities/frete.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Frete])],
  controllers: [FretesController],
  providers: [FretesService],
})
export class FretesModule {}
