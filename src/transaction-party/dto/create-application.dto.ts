import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateApplicationDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  website_url: string;

  @IsOptional()
  @ApiProperty()
  logo_url?: string;

  @IsNotEmpty()
  @ApiProperty()
  data_access: string[];
}
