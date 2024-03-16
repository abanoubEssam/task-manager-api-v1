import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { TaskStatus } from '../interfaces/tasks.interface';

export class CreateTaskDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  assignedUser: string;

  @ApiProperty({
    default: TaskStatus.TODO,
  })
  @IsEnum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
  @IsDefined()
  status: TaskStatus;

  @ApiProperty({
    description: 'Due Date should be in milliseconds',
  })
  @IsDefined()
  @IsNumber()
  @IsNotEmpty()
  dueDate?: number;
}
