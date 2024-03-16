import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schemas/tasks.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Task.name.toLowerCase(),
        schema: TaskSchema,
      },
    ]),
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
