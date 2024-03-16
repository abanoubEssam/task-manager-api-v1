import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
  @ApiProperty({
    default: 'super@admin.com',
  })
  @IsEmail({}, { message: 'i18n:not.email.error' })
  @IsString()
  @IsDefined()
  email: string;

  @ApiProperty({
    default: 'default-password',
  })
  @IsString()
  @IsDefined()
  password: string;
}
