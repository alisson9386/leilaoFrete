import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtMiddleware } from './auth/jwt.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UsuariosModule } from './module/usuarios.module';
import { Usuario } from './entities/usuario.entity';
import { FreteirosModule } from './module/freteiros.module';
import { LoggingInterceptor } from './logging.interceptor';
import { LoggerService } from './service/logger.service';
import { WhatsAppModule } from './module/whatsapp.module';
import { WhatsAppService } from './service/whatsapp.service';
import { FreteirosService } from './service/freteiros.service';
import { Freteiro } from './entities/freteiro.entity';
import { TipoUsersModule } from './module/tipo-users.module';
import { TipoUser } from './entities/tipo-user.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: 'zaq12wsxZAQ!@WSXZ0rr0b@tmak',
      signOptions: { expiresIn: '30m' },
    }),
    UsuariosModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [Usuario, Freteiro, TipoUser],
      synchronize: false,
    }),
    UsuariosModule,
    FreteirosModule,
    WhatsAppModule,
    TipoUsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
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
        { path: 'whatsapp/statusServidor', method: RequestMethod.GET}
      )
      .forRoutes('*');
  }
}
