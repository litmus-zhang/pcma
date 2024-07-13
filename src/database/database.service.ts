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
  async cleanDb() {
    // Manually list all your table names here
    const tableNames = [
      'User',
      'TransactionParty',
      'UserTransactionParty',
      'personal_id',
      'basic_pii',
      'secret_pii',
      'user_tp_request',
      'application',
    ]; // Example table names

    // Build and execute a raw SQL query for each table
    for (const tableName of tableNames) {
      await this.$executeRawUnsafe(
        `TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE;`,
      );
    }
  }
}
