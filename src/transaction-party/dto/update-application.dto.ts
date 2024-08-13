import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateApplicationDto {
  @IsOptional()
  @ApiProperty()
  purpose_of_access?: string;

  @IsNotEmpty({
    message:"There must be at least one access selected or deactivate the application"
  })
  @ApiProperty()
  data_access: string[];
}
