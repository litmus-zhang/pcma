import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { TransactionPartyService } from './transaction-party.service';
import { GetUser } from '../auth/decorators';
import { TransactionParty } from '@prisma/client';
import { CompanyRegisterDto } from '../auth/dto';
import { JwtGuard } from '../auth/guards';
import { CreateApplicationDto } from './dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
// import { ResponseStatus } from 'src/types/response.status';

@UseGuards(JwtGuard)
@ApiTags('Transaction Party/Service Provider')
@Controller('tp')
export class TransactionPartyController {
  constructor(
    private readonly transactionPartyService: TransactionPartyService,
  ) {}

  @Get('profile')
  @ApiOperation({
    summary: 'Get Service Provider profile details',
  })
  async getMe(@GetUser() transactionParty: TransactionParty) {
    console.log('transactionParty', transactionParty);
    return transactionParty;
  }
  @Patch('profile')
  @ApiOperation({
    summary: 'Update Service Provider profile',
  })
  async updateMe(
    @GetUser('id') transactionPartyId: number,
    @Body() dto: CompanyRegisterDto,
  ) {
    return this.transactionPartyService.editMe(transactionPartyId, dto);
  }

  @Get('dashboard')
  @ApiOperation({
    summary: 'Get Service Provider dashboard data',
  })
  async getDashboard(@GetUser('id') transactionPartyId: number) {
    return this.transactionPartyService.getDashboard(transactionPartyId);
  }
  @Post('application')
  @ApiOperation({
    summary: 'Create an application',
  })
  async createApplication(
    @GetUser('id') transactionPartyId: number,
    @Body() dto: CreateApplicationDto,
  ) {
    return this.transactionPartyService.createApplication(
      transactionPartyId,
      dto,
    );
  }
  @Get('application')
  @ApiOperation({
    summary: 'Get all applications',
  })
  async getApplications(@GetUser('id') transactionPartyId: number) {
    return this.transactionPartyService.getApplications(transactionPartyId);
  }
}
