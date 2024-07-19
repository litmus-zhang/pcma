import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsEmail({})
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
