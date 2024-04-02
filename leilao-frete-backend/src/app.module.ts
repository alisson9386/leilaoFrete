import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JwtMiddleware } from './auth/jwt.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UsuariosModule } from './module/usuarios.module';
import { Usuario } from './entities/usuario.entity';
import { ProprietarioModule } from './module/proprietario.module';
import { LoggingInterceptor } from './logging.interceptor';
import { LoggerService } from './service/logger.service';
import { WhatsAppService } from './service/whatsapp.service';
import { ProprietarioService } from './service/proprietario.service';
import { Proprietario } from './entities/proprietario.entity';
import { TipoUsersModule } from './module/tipo-users.module';
import { TipoUser } from './entities/tipo-user.entity';
import { VeiculoModule } from './module/veiculo.module';
import { ProprietarioController } from './controller/proprietario.controller';
import { TipoUsersController } from './controller/tipo-users.controller';
import { UsuariosController } from './controller/usuarios.controller';
import { VeiculoController } from './controller/veiculo.controller';
import { WhatsappController } from './controller/whatsapp.controller';
import { TipoProprietarioModule } from './module/tipo_proprietario.module';
import { TipoCarroceriaVeiculoModule } from './module/tipo_carroceria_veiculo.module';
import { TipoRodadoVeiculoModule } from './module/tipo_rodado_veiculo.module';
import { UfModule } from './module/uf.module';
import { WhatsAppModule } from './module/whatsapp.module';
import { TipoProprietario } from './entities/tipo_proprietario.entity';
import { TipoCarroceriaVeiculo } from './entities/tipo_carroceria_veiculo.entity';
import { TipoRodadoVeiculo } from './entities/tipo_rodado_veiculo.entity';
import { Uf } from './entities/uf.entity';
import { Veiculo } from './entities/veiculo.entity';
import { LocaisColetaModule } from './module/locais-coleta.module';
import { LocaisColeta } from './entities/locais-coleta.entity';
import { FretesModule } from './module/fretes.module';
import { Frete } from './entities/frete.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: 'zaq12wsxZAQ!@WSXZ0rr0b@tmak',
      signOptions: { expiresIn: '24h' },
    }),
    UsuariosModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [
        Usuario,
        Proprietario,
        TipoUser,
        TipoProprietario,
        TipoCarroceriaVeiculo,
        TipoRodadoVeiculo,
        Uf,
        Veiculo,
        LocaisColeta,
        Frete
      ],
      synchronize: false,
    }),
    UsuariosModule,
    ProprietarioModule,
    TipoUsersModule,
    VeiculoModule,
    TipoProprietarioModule,
    TipoCarroceriaVeiculoModule,
    TipoRodadoVeiculoModule,
    UfModule,
    WhatsAppModule,
    LocaisColetaModule,
    FretesModule,
  ],
  controllers: [],
  providers: [
    JwtMiddleware,
    WhatsAppService,
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    LoggerService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude(
        { path: 'users/login', method: RequestMethod.POST },
        { path: 'users', method: RequestMethod.POST },
        { path: 'users/user/:user', method: RequestMethod.GET },
        { path: 'users/:id', method: RequestMethod.PATCH },
      )
      .forRoutes('*');
  }
}
