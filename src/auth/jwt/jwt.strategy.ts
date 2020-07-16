import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/core/config/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private _configService: ConfigService) {    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: Boolean(_configService.get('IGNORE_EXPIRATION')),
      secretOrKey: _configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return { _id: payload.sub, username: payload.username };
  }
}