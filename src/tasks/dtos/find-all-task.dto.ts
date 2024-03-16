import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { TaskStatus } from '../interfaces/tasks.interface';

export class FindAllTasksDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  assignedUser?: string;

  @ApiPropertyOptional()
  @IsEnum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
  @IsDefined()
  @IsOptional()
  status?: TaskStatus;
}
