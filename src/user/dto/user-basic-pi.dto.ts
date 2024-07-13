import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UserBasicPiiDto {
  @IsString()
  @ApiProperty()
  @IsOptional()
  firstName?: string;

  @IsOptional()
  @ApiProperty()
  lastName?: string;

  @IsEmail()
  @ApiProperty()
  email?: string;
}
