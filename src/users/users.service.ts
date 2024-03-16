import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Document, FilterQuery, Model } from 'mongoose';
import { Password } from 'src/common/utils/password';
import { EnvironmentVariables } from 'src/config/EnvironmentVariables';
import { CreateUserDto } from './dtos/create-user.dto';
import { FindAllUsersDto } from './dtos/find-users.dto';
import { User, UserDocument } from './schemas/user.schema';
import { AppRoles } from './interfaces/users.interface';
import { SupportedLanguages } from 'src/constants';
import { PaginatedResponse } from 'src/common/utils/models/paginated-response';
import { ApiErrors } from 'src/common/utils/api-errors';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectModel(User.name.toLowerCase())
    private _userModel: Model<UserDocument>,
    private readonly _configService: ConfigService<EnvironmentVariables>,
  ) {}

  async onModuleInit() {
    // create super admin if not exists
    const superAdminData = this._configService.get('super_admin', {
      infer: true,
    });
    const foundSuperAdmin = await this.findOne({
      email: superAdminData.email,
    });
    if (!foundSuperAdmin) {
      const hashedPassword = await Password.hashPassword(
        superAdminData.password,
      );
      await this._userModel.create({
        ...superAdminData,
        password: hashedPassword,
        role: AppRoles.SUPER_ADMIN,
        language: SupportedLanguages.EN,
      });
      console.log('SuperAdmin Created!');
    }
  }

  async create(createUserDto: CreateUserDto) {
    const emailTaken = await this.findOne({ email: createUserDto.email });
    if (emailTaken) {
      throw ApiErrors.Conflict({ message: 'Email already taken' });
    }
    const hashedPassword = await Password.hashPassword(createUserDto.password);
    return this._userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async findAll(
    findAllUsersDto: FindAllUsersDto,
    currentUser: UserDocument,
  ): Promise<PaginatedResponse<UserDocument>> {
    const page = findAllUsersDto.page || 1;
    const limit = findAllUsersDto.limit || 10;
    const skip = (page - 1) * limit;
    const query = {};
    if (findAllUsersDto.name) {
      query['name'] = new RegExp(findAllUsersDto.name, 'i');
    }
    if (findAllUsersDto.email) {
      query['email'] = new RegExp(findAllUsersDto.email, 'i');
    }
    if (findAllUsersDto.role) {
      query['role'] = findAllUsersDto.role;
    }
    if (currentUser) {
      query['_id'] = { $ne: currentUser._id };
    }
    const totalCount = await this._userModel.find(query).countDocuments();
    const limitCount = findAllUsersDto.ignoreLimit ? totalCount : limit;
    const data = await this._userModel.find(query).skip(skip).limit(limitCount);
    return new PaginatedResponse({
      data,
      limit,
      page,
      totalCount,
      ignoreLimit: findAllUsersDto.ignoreLimit,
    });
  }

  async findOne(
    filter?: FilterQuery<Document<unknown, any, User> & User>,
  ): Promise<UserDocument> {
    const user = await this._userModel.findOne(filter);
    return user;
  }
}
