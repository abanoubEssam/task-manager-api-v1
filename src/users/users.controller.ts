import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { FindAllUsersDto } from './dtos/find-users.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SupportedLanguages } from 'src/constants';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AppRoles } from './interfaces/users.interface';
import { PaginatedResponse } from 'src/common/utils/models/paginated-response';
import { UserDocument } from './schemas/user.schema';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiBearerAuth()
@Roles(AppRoles.SUPER_ADMIN)
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(
    @Headers('accept-language') acceptLanguage: SupportedLanguages,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(
    @Headers('accept-language') acceptLanguage: SupportedLanguages,
    @Query() findAllUsersDto: FindAllUsersDto,
    @CurrentUser() currentUser: UserDocument,
  ): Promise<PaginatedResponse<UserDocument>> {
    return this.usersService.findAll(findAllUsersDto, currentUser);
  }

  @Get(':id')
  findOne(
    @Headers('accept-language') acceptLanguage: SupportedLanguages,
    @Param('id') id: string,
  ) {
    return this.usersService.findOne({ id });
  }
}
