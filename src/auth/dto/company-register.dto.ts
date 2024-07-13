import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
import { IsSameValueAs } from './IsSameValue';
import { ApiProperty } from '@nestjs/swagger';

export class CompanyRegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({})
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
  companyName: string;

  @IsNotEmpty()
  @ApiProperty()
  companyAddress: string;

  @IsNotEmpty()
  @ApiProperty()
  fullName: string;

  @IsNotEmpty()
  @ApiProperty()
  phoneNumber: string;

  @IsNotEmpty()
  @ApiProperty()
  registrationNumber: string;
}
