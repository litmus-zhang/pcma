import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Application Health')
@Controller()
export class AppController {
  constructor() {}
  @Get('health')
  @ApiOperation({
    summary: 'Health Check',
  })
  @HttpCode(HttpStatus.OK)
  healthCheck() {
    return {
      status: 'Ok',
      message: 'Healthy',
    };
  }
}
