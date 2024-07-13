import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsStrongPassword } from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsEmail({})
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsStrongPassword()
  password: string;
}
