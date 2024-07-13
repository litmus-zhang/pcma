import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UserUpdateDto {
  @IsString()
  @ApiProperty()
  @IsOptional()
  firstName?: string;

  @IsOptional()
  @ApiProperty()
  lastName?: string;

  @IsEmail()
  @ApiProperty()
  @IsOptional()
  email?: string;

  @IsOptional()
  @ApiProperty()
  password?: string;
}
