import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { AppModule } from './../src/app.module';
import * as pactum from 'pactum';
import { DatabaseService } from '../src/database/database.service';
import { RegisterDto } from 'src/auth/dto';

describe('PCMA (e2e) testing', () => {
  let app: INestApplication;
  let db: DatabaseService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    app.setGlobalPrefix('api');
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: ['1', '2'],
    });
    await app.init();
    await app.listen(3001);

    db = app.get<DatabaseService>(DatabaseService);
    await db.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3001/api/v1');
  });
  afterAll(async () => {
    app.close();
  });
  describe('Health Check', () => {
    it('should return 200', async () => {
      await pactum.spec().get('/health').expectStatus(200);
    });
    it('should return status Ok and message Healthy', async () => {
      await pactum
        .spec()
        .get('/health')
        .expectJson({ status: 'Ok', message: 'Healthy' });
    });
  });
  describe('Authentication Module', () => {
    describe('User Authentication', () => {
      describe('User signup', () => {
        const registerDto: RegisterDto = {
          email: 'sample@test.com',
          password: 'Password@1',
          confirmPassword: 'Password@1',
          firstName: 'John',
          lastName: 'Doe',
        };
        it('should return error if email is not provided', () => {
          return pactum
            .spec()
            .post('/auth/signup')
            .withJson({ ...registerDto, email: '' })
            .expectStatus(400);
        });
        it('should return error if password is not provided', () => {
          return pactum
            .spec()
            .post('/auth/signup')
            .withJson({ ...registerDto, password: '' })
            .expectStatus(400);
        });
        it('should return error and message if password and confirmPassword is not the same', () => {
          return pactum
            .spec()
            .post('/auth/signup')
            .withJson({ ...registerDto, password: 'Password' })
            .expectStatus(400)
            .expectBodyContains('confirmPassword must match password');
        });
        it('should return error if firstname is not provided', () => {
          return pactum
            .spec()
            .post('/auth/signup')
            .withJson({ ...registerDto, firstName: '' })
            .expectStatus(400);
        });
        it('should return error if lastname is not provided', () => {
          return pactum
            .spec()
            .post('/auth/signup')
            .withJson({ ...registerDto, lastName: '' })
            .expectStatus(400);
        });
        it('should return error if no body is not provided', () => {
          return pactum.spec().post('/auth/signup').expectStatus(400);
        });
        it('should return success message and status OK if all data is provided', () => {
          return pactum
            .spec()
            .post('/auth/signup')
            .withJson(registerDto)
            .expectStatus(201)
            .expectJson({ message: 'User registered successfully' });
        });
      });
    });
    describe('Transaction Party Authentication', () => {});
  });
  describe('User-Transaction party interaction', () => {
    describe('user signup on transaction party using the PCMA provider', () => {});
    describe('user access the services of a transaction party', () => {});
    describe('transaction party requesting for secret PII from user', () => {});
  });
  describe('User-Web crawling interaction', () => {});
});
