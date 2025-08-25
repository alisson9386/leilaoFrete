import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtMiddleware } from './auth/jwt.middleware';
import { FreteVeiculoQuantidade } from './entities/frete-veiculo-quantidade.entity';
import { Frete } from './entities/frete.entity';
import { LancesFrete } from './entities/lances-frete.entity';
import { LocaisColeta } from './entities/locais-coleta.entity';
import { ProdutosLeilao } from './entities/produtos-leilao.entity';
import { Proprietario } from './entities/proprietario.entity';
import { TipoUser } from './entities/tipo-user.entity';
import { TipoCarroceriaVeiculo } from './entities/tipo_carroceria_veiculo.entity';
import { TipoProprietario } from './entities/tipo_proprietario.entity';
import { TipoRodadoVeiculo } from './entities/tipo_rodado_veiculo.entity';
import { Uf } from './entities/uf.entity';
import { UnidadeMedida } from './entities/unidade-medida.entity';
import { Usuario } from './entities/usuario.entity';
import { Veiculo } from './entities/veiculo.entity';
import { LoggingInterceptor } from './logging.interceptor';
import { FreteVeiculoQuantidadeModule } from './module/frete-veiculo-quantidade.module';
import { FretesModule } from './module/fretes.module';
import { LancesFreteModule } from './module/lances-frete.module';
import { LocaisColetaModule } from './module/locais-coleta.module';
import { ProdutosLeilaoModule } from './module/produtos-leilao.module';
import { ProprietarioModule } from './module/proprietario.module';
import { TipoUsersModule } from './module/tipo-users.module';
import { TipoCarroceriaVeiculoModule } from './module/tipo_carroceria_veiculo.module';
import { TipoProprietarioModule } from './module/tipo_proprietario.module';
import { TipoRodadoVeiculoModule } from './module/tipo_rodado_veiculo.module';
import { UfModule } from './module/uf.module';
import { UnidadeMedidaModule } from './module/unidade-medida.module';
import { UsuariosModule } from './module/usuarios.module';
import { VeiculoModule } from './module/veiculo.module';
import { WhatsAppModule } from './module/whatsapp.module';
import { LoggerService } from './service/logger.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: 'zaq12wsxZAQ!@WSXZ0rr0b@tmak',
      signOptions: { expiresIn: '6h' },
    }),
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
        Frete,
        FreteVeiculoQuantidade,
        UnidadeMedida,
        ProdutosLeilao,
        LancesFrete
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
    FreteVeiculoQuantidadeModule,
    ProdutosLeilaoModule,
    UnidadeMedidaModule,
    LancesFreteModule,
  ],
  controllers: [],
  providers: [
    JwtMiddleware,
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
