import { Module } from '@nestjs/common';
import { TipoUsersService } from '../service/tipo-users.service';
import { TipoUsersController } from '../controller/tipo-users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoUser } from '../entities/tipo-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoUser])],
  controllers: [TipoUsersController],
  providers: [TipoUsersService],
})
export class TipoUsersModule {}
