import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Document, FilterQuery, Model, Types } from 'mongoose';
import { PaginatedResponse } from 'src/common/utils/models/paginated-response';
import { EnvironmentVariables } from 'src/config/EnvironmentVariables';
import { FindAllTasksDto } from './dtos/find-all-task.dto';
import { Task, TaskDocument } from './schemas/tasks.schema';
import { CreateTaskDto } from './dtos/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name.toLowerCase())
    private _taskModel: Model<TaskDocument>,
    private readonly _configService: ConfigService<EnvironmentVariables>,
  ) {}
  create(createTaskDto: CreateTaskDto) {
    console.log("🚀 ~ TasksService ~ create ~ createTaskDto:", createTaskDto)
    return this._taskModel.create(createTaskDto);
  }

  async findAll(
    findAllTasksDto: FindAllTasksDto,
  ): Promise<PaginatedResponse<TaskDocument>> {
    const page = findAllTasksDto.page || 1;
    const limit = findAllTasksDto.limit || 10;
    const skip = (page - 1) * limit;
    const query = {};
    if (findAllTasksDto.title) {
      query['title'] = new RegExp(findAllTasksDto.title, 'i');
    }
    const totalCount = await this._taskModel.find(query).countDocuments();
    const limitCount = findAllTasksDto.ignoreLimit ? totalCount : limit;
    const data = await this._taskModel.find(query).skip(skip).limit(limitCount);
    return new PaginatedResponse({
      data,
      limit,
      page,
      totalCount,
      ignoreLimit: findAllTasksDto.ignoreLimit,
    });
  }

  findOne(
    filter?: FilterQuery<
      Document<unknown, {}, Task> & Task & { _id: Types.ObjectId }
    >,
  ) {
    return this._taskModel.findOne(filter);
  }
}
