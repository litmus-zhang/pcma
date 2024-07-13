import { IsDate, IsOptional, IsString } from 'class-validator';
import { UserBasicPiiDto } from '.';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserSensitivePiiDto extends UserBasicPiiDto {
  @Type(() => Date)
  @IsDate()
  @ApiProperty()
  dateOfBirth: Date;

  @IsOptional()
  @ApiProperty()
  homeAddress?: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  country?: string;

  @IsOptional()
  @ApiProperty()
  occupation?: string;

  @IsOptional()
  @ApiProperty()
  phoneNumber?: string;
}
