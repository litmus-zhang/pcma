import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { TransactionPartyService } from './transaction-party.service';
import { GetUser } from '../auth/decorators';
import { TransactionParty } from '@prisma/client';
import { CompanyRegisterDto } from '../auth/dto';
import { JwtGuard } from '../auth/guards';
// import { ResponseStatus } from 'src/types/response.status';

@UseGuards(JwtGuard)
@Controller('tp')
export class TransactionPartyController {
  constructor(
    private readonly transactionPartyService: TransactionPartyService,
  ) {}

  @Get('profile')
  async getMe(@GetUser() transactionParty: TransactionParty) {
    console.log('transactionParty', transactionParty);
    return transactionParty;
  }
  @Patch('profile')
  async updateMe(
    @GetUser('id') transactionPartyId: number,
    @Body() dto: CompanyRegisterDto,
  ) {
    return this.transactionPartyService.editMe(transactionPartyId, dto);
  }
}
