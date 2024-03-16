import { Body, Controller, Post, Headers } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { AuthResponse } from './interfaces/auth-response';
import { User } from 'src/users/schemas/user.schema';
import { UserLoginDto } from './dtos/user-login.dto';
import { SupportedLanguages } from 'src/constants';
@ApiTags('Auth')
@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('/login')
  async login(
    @Body() userLoginDto: UserLoginDto,
    @Headers('accept-language') acceptLanguage: SupportedLanguages,
  ): Promise<AuthResponse<User>> {
    return await this._authService.login(userLoginDto);
  }
}
