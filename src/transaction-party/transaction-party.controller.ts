import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { TransactionPartyService } from './transaction-party.service';
import { GetUser } from 'src/auth/decorators';
import { TransactionParty } from '@prisma/client';
import { CompanyRegisterDto } from 'src/auth/dto';
import { JwtGuard } from 'src/auth/guards';

@UseGuards(JwtGuard)
@Controller('transaction-party')
export class TransactionPartyController {
  constructor(
    private readonly transactionPartyService: TransactionPartyService,
  ) {}

  @Get('profile')
  async getMe(@GetUser() transactionParty: TransactionParty) {
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
