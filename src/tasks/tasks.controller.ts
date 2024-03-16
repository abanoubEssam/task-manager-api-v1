import { Body, Controller, Get, Headers, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { SupportedLanguages } from 'src/constants';
import { AppRoles } from 'src/users/interfaces/users.interface';
import { UserDocument } from 'src/users/schemas/user.schema';
import { FindAllTasksDto } from './dtos/find-all-task.dto';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dtos/create-task.dto';

@ApiBearerAuth()
@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Roles(AppRoles.SUPER_ADMIN)
  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Roles(AppRoles.SUPER_ADMIN, AppRoles.USER)
  @Get()
  findAll(
    @Headers('accept-language') acceptLanguage: SupportedLanguages,
    @Query() _findAllTasksDto: FindAllTasksDto,
    @CurrentUser() currentUser: UserDocument,
  ) {
    return this.tasksService.findAll(_findAllTasksDto);
  }

  @Get(':id')
  @Roles(AppRoles.SUPER_ADMIN, AppRoles.USER)
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne({ id });
  }
}
