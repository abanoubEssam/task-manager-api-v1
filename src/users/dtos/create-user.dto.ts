import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsEnum, IsString } from 'class-validator';
import { DtoTransformer } from 'src/common/dtos/dto-transformer.model';
import { SupportedLanguages } from 'src/constants';

export class CreateUserDto extends DtoTransformer {
  @ApiProperty()
  @IsDefined()
  @IsString()
  name: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  password: string;

  @ApiProperty({
    enum: SupportedLanguages,
  })
  @IsEnum(SupportedLanguages)
  language: string;
}
