import { ConfigModule } from './../core/config/config.module';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule, PassportStrategy } from '@nestjs/passport';
import { LocalStrategy } from './jwt/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { authController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/models/user.model';
import { ConfigService } from 'src/core/config/config.service';
import { jwtConstants } from './constants';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET')
        };
      },
      inject: [ConfigService]
    }),
    ConfigModule,
  ],  
  controllers: [authController],
  providers: [AuthService,LocalStrategy,JwtStrategy],
  exports: [AuthService],
  
})
export class AuthModule {}
