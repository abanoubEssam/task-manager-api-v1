import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { AppRoles } from '../interfaces/users.interface';

export class FindAllUsersDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    enum: Object.keys(AppRoles),
  })
  @IsDefined()
  @IsNotEmpty()
  @IsOptional()
  @IsEnum(Object.keys(AppRoles))
  role?: AppRoles;

  @ApiPropertyOptional()
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  email?: string;
}
