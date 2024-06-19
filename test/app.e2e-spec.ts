import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { AppModule } from './../src/app.module';
import * as pactum from 'pactum';
import { DatabaseService } from '../src/database/database.service';
import {
  CompanyRegisterDto,
  UserLoginDto,
  UserRegisterDto,
} from 'src/auth/dto';

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
        const registerDto: UserRegisterDto = {
          email: 'sample@test.com',
          password: 'Password@1',
          confirmPassword: 'Password@1',
          firstName: 'John',
          lastName: 'Doe',
        };

        it('should return error if email is not provided', () => {
          return pactum
            .spec()
            .post('/auth/user/signup')
            .withJson({ ...registerDto, email: '' })
            .expectStatus(400);
        });
        it('should return error if password is not provided', () => {
          return pactum
            .spec()
            .post('/auth/user/signup')
            .withJson({ ...registerDto, password: '' })
            .expectStatus(400);
        });
        it('should return error and message if password and confirmPassword is not the same', () => {
          return pactum
            .spec()
            .post('/auth/user/signup')
            .withJson({ ...registerDto, password: 'Password' })
            .expectStatus(400)
            .expectBodyContains('confirmPassword must match password');
        });
        it('should return error if firstname is not provided', () => {
          return pactum
            .spec()
            .post('/auth/user/signup')
            .withJson({ ...registerDto, firstName: '' })
            .expectStatus(400);
        });
        it('should return error if lastname is not provided', () => {
          return pactum
            .spec()
            .post('/auth/user/signup')
            .withJson({ ...registerDto, lastName: '' })
            .expectStatus(400);
        });
        it('should return error if no body is not provided', () => {
          return pactum.spec().post('/auth/user/signup').expectStatus(400);
        });
        it('should return success message and status OK if all data is provided', () => {
          return pactum
            .spec()
            .post('/auth/user/signup')
            .withJson(registerDto)
            .expectStatus(201)
            .expectJson({ message: 'User registered successfully' });
        });
      });
      describe('User Login', () => {
        const loginDto: UserLoginDto = {
          email: 'sample@test.com',
          password: 'Password@1',
        };
        it('should return error if email is not provided', () => {
          return pactum
            .spec()
            .post('/auth/user/login')
            .withJson({ ...loginDto, email: '' })
            .expectStatus(400);
        });
        it('should return error if password is not provided', () => {
          return pactum
            .spec()
            .post('/auth/user/login')
            .withJson({ ...loginDto, password: '' })
            .expectStatus(400);
        });
        it('should return error if no body is not provided', () => {
          return pactum.spec().post('/auth/user/login').expectStatus(400);
        });
        it('should return success message and status OK if all data is provided', () => {
          return pactum
            .spec()
            .post('/auth/user/login')
            .withJson(loginDto)
            .expectStatus(201)
            .expectBodyContains('User login successfully')
            .stores('token', 'body.token');
        });
      });
    });
    describe('Transaction Party Authentication', () => {
      const registerDto: CompanyRegisterDto = {
        email: 'sample@test.com',
        password: 'Password@1',
        confirmPassword: 'Password@1',
        companyName: 'John Snow LLC',
      };
      describe('Transaction Party signup', () => {
        it('should return error if email is not provided', () => {
          return pactum
            .spec()
            .post('/auth/tp/signup')
            .withJson({ ...registerDto, email: '' })
            .expectStatus(400);
        });
        it.todo('should not allow generic mail like @gmail.com or @yahoo.com');
        it('should throw error when a field(company name) is not provided', () => {
          return pactum
            .spec()
            .post('/auth/tp/signup')
            .withJson({ ...registerDto, companyName: '' })
            .expectStatus(400);
        });
      });
      describe('Transaction Party login', () => {
        const loginDto: UserLoginDto = {
          email: 'sample@test.com',
          password: 'Password@1',
        };
        it('should return error if email is not provided', () => {
          return pactum
            .spec()
            .post('/auth/tp/login')
            .withJson({ ...loginDto, email: '' })
            .expectStatus(400);
        });
        it('should throw error when a field is not provided', () => {
          return pactum
            .spec()
            .post('/auth/tp/login')
            .withJson({ loginDto, password: '' })
            .expectStatus(400);
        });
        it('should return success message and status OK if all data is provided', () => {
          return pactum
            .spec()
            .post('/auth/tp/login')
            .withJson(loginDto)
            .expectStatus(201)
            .expectBodyContains('Company login successfully');
        });
      });
    });
  });
  describe('User-Transaction party interaction', () => {
    describe('user signup on transaction party using the PCMA provider', () => {});
    describe('user access the services of a transaction party', () => {});
    describe('transaction party requesting for secret PII from user', () => {});
  });
  describe('User-Web crawling interaction', () => {});
});
