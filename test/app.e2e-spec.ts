import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';

describe('AppController (e2e) testing', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Authentication Module', () => {
    describe('User Authentication', () => {});
    describe('Transaction Party Authentication', () => {});
  });
  describe('User-Transaction party interaction', () => {
    describe('user signup on transaction party using the PCMA provider', () => {});
    describe('user access the services of a transaction party', () => {});
    describe('transaction party requesting for secret PII from user', () => {});
  });
  describe('User-Web crawling interaction', () => {});
});
