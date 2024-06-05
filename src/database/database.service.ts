import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }
  cleanDb() {
    return this.$transaction([
      this.user.deleteMany(),
      this.transactionParty.deleteMany(),
      this.userTransactionParty.deleteMany(),
      this.transactionParty.deleteMany(),
      this.basic_pii.deleteMany(),
      this.secret_pii.deleteMany(),
      this.personal_id.deleteMany(),
    ]);
  }
}
