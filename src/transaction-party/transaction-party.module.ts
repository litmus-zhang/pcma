import { Module } from '@nestjs/common';
import { TransactionPartyService } from './transaction-party.service';
import { TransactionPartyController } from './transaction-party.controller';

@Module({
  controllers: [TransactionPartyController],
  providers: [TransactionPartyService],
})
export class TransactionPartyModule {}
