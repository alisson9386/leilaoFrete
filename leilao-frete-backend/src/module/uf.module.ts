import { Module } from '@nestjs/common';
import { UfService } from '../service/uf.service';
import { UfController } from '../controller/uf.controller';

@Module({
  controllers: [UfController],
  providers: [UfService],
})
export class UfModule {}
