import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
import { IsSameValueAs } from './IsSameValue';

export class UserRegisterDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @IsSameValueAs('password', { message: 'confirmPassword must match password' })
  confirmPassword: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;
}
