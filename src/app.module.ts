import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TransactionPartyModule } from './transaction-party/transaction-party.module';
import { DatabaseModule } from './database/database.module';
import { NotificationModule } from './notification/notification.module';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { JwtModule } from '@nestjs/jwt';
// import { DevtoolsModule } from '@nestjs/devtools-integration';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TransactionPartyModule,
    DatabaseModule,
    NotificationModule,
    JwtModule.register({
      global: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // DevtoolsModule.register({
    //   http: process.env.NODE_ENV !== 'production',
    //   // port: 3002,
    // }),
  ],
  controllers: [AppController],
})
export class AppModule {}
