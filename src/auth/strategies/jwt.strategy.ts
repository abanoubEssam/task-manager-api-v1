import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvironmentVariables } from 'src/config/EnvironmentVariables';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
    private readonly _userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.jwtSecret', { infer: true }),
    });
  }

  async validate(payload: IJwtPayload, done: Function) {
    const user = await this._userService.findOne({ _id: payload.sub });
    if (!user) {
      return done(new ForbiddenException());
    }
    const currentUser = {
      _id: user.id,
      role: user.role,
      language: user.language,
      email: user.email,
      name: user.name,
    };

    done(null, currentUser);
  }
}
