import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from './core/config/config.module';
import { ConfigService } from './core/config/config.service';
import { BookModule } from './book/book.module';


@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb+srv://${configService.get('DB_USER')}:${configService.get('DB_PWD')}@${configService.get('DB_URI')}/${configService.get('DB_NAME')}?${configService.get('DB_PARAMS')}`,
        useNewUrlParser: true
      }),
      inject: [ConfigService]
    }),

    AuthModule,
    ConfigModule,
    BookModule,
  ],
  controllers: [AppController],
  providers: [
  ],
})
export class AppModule {
  static port: number | string;

  constructor(private _configService: ConfigService) {
    AppModule.port = this._configService.get('PORT');
    console.log('AppModule.port', AppModule.port);
  }
}
