import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TransactionPartyModule } from './transaction-party/transaction-party.module';
import { DatabaseModule } from './database/database.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  providers: [AppService],
  imports: [
    AuthModule,
    UserModule,
    TransactionPartyModule,
    DatabaseModule,
    NotificationModule,
  ],
})
export class AppModule {}
