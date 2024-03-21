import { Module } from '@nestjs/common';
import { UfService } from '../service/uf.service';
import { UfController } from '../controller/uf.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Uf } from 'src/entities/uf.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Uf])],
  controllers: [UfController],
  providers: [UfService],
})
export class UfModule {}
