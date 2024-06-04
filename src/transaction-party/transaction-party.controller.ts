import { Controller } from '@nestjs/common';
import { TransactionPartyService } from './transaction-party.service';

@Controller('transaction-party')
export class TransactionPartyController {
  constructor(private readonly transactionPartyService: TransactionPartyService) {}
}
