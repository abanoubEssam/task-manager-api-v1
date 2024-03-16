import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiErrors } from 'src/common/utils/api-errors';
import { UsersService } from 'src/users/users.service';
import { AuthResponse } from './interfaces/auth-response';
import { User } from 'src/users/schemas/user.schema';
import { UserLoginDto } from './dtos/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly _userService: UsersService,
  ) {}

  async login(
    userLoginDto: UserLoginDto,
  ): Promise<AuthResponse<User>> {
    const user = await this._userService.findOne({email: userLoginDto.email});
    const payload = { email: user.email, sub: user._id, role: user.role };
    if (!user) {
      throw ApiErrors.Forbidden({
        message: 'not.allowed.error',
        isI18nMessage: true,
      });
    }
    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
