import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
import { IsSameValueAs } from './IsSameValue';
import { ApiProperty } from '@nestjs/swagger';

export class UserRegisterDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsSameValueAs('password', { message: 'confirmPassword must match password' })
  confirmPassword: string;

  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsNotEmpty()
  @ApiProperty()
  lastName: string;
}
