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
import { UserBasicPiiDto, UserSensitivePiiDto } from 'src/user/dto';

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
            .stores('userAt', 'token.access_token');
        });
      });
    });
    describe('Transaction Party Authentication', () => {
      const registerDto: CompanyRegisterDto = {
        email: 'sample@test.com',
        password: 'Password@1',
        confirmPassword: 'Password@1',
        companyName: 'John Snow LLC',
        companyAddress: '123 Main Street',
        fullName: 'John Snow',
        phoneNumber: '1234567890',
        registrationNumber: '1234567890',
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
        it('should return success message and status OK if all data is provided', () => {
          return pactum
            .spec()
            .post('/auth/tp/signup')
            .withJson(registerDto)
            .expectStatus(201)
            .expectBodyContains('Company registered successfully');
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
            .withJson({ ...loginDto, password: '' })
            .expectStatus(400);
        });
        it('should return success message and status OK if all data is provided', () => {
          return pactum
            .spec()
            .post('/auth/tp/login')
            .withJson(loginDto)
            .expectStatus(201)
            .expectBodyContains('Company login successfully')
            .stores('tpAt', 'token.access_token');
        });
      });
    });
  });
  describe('User Module', () => {
    describe('User Profile', () => {
      it('should return error if user is not authenticated', () => {
        return pactum.spec().get('/user/profile').expectStatus(401);
      });
      it('should return user profile', () => {
        return pactum
          .spec()
          .get('/user/profile')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200);
      });
      it('should update user profile', () => {
        return pactum
          .spec()
          .patch('/user/profile')
          .withBearerToken('$S{userAt}')
          .withJson({ firstname: 'John', lastname: 'Doe' })
          .expectStatus(200)
          .expectBodyContains('User profile updated successfully');
      });
    });
    describe('Set  User PII', () => {
      const basic_pii: UserBasicPiiDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'sample@test.com',
      };
      const secret_pii: UserSensitivePiiDto = {
        ...basic_pii,
        homeAddress: '123 Main Street',
        country: '1234567890',
        phoneNumber: '1234567890',
        dateOfBirth: new Date('1990-01-01'),
        occupation: 'Software Engineer',
      };
      it('should set basic PII', () => {
        return pactum
          .spec()
          .post('/user/basic-pii')
          .withBearerToken('$S{userAt}')
          .withBody(basic_pii)
          .expectStatus(201)
          .expectBodyContains('User Basic PII updated successfully');
      });
      it('should set personal PII', () => {
        return pactum
          .spec()
          .post('/user/sensitive-pii')
          .withBearerToken('$S{userAt}')
          .withBody(secret_pii)
          .expectStatus(201)
          .expectBodyContains('User Personal PII updated successfully');
      });
    });
    describe('User Dashboard', () => {
      it('should return error if user is not authenticated', () => {
        return pactum.spec().get('/user/dashboard').expectStatus(401);
      });
      it('should return user dashboard data', () => {
        return pactum
          .spec()
          .get('/user/dashboard')
          .withBearerToken('$S{userAt}')
          .expectBodyContains('User dashboard data fetched successfully')
          .expectBody({
            data: {
              request: {
                pending: 0,
                approved: 0,
                revoked: 0,
                data_leaks: 0,
              },
              activities: {
                total: 0,
                data: [],
              },
            },
            message: 'User dashboard data fetched successfully',
            status: 200,
          });
      });
    });
  });
  describe('Transaction Party Module', () => {
    describe('Transaction Party Profile', () => {
      it('should return error if company is not authenticated', () => {
        return pactum.spec().get('/tp/profile').expectStatus(401);
      });
      // it('should return company profile', () => {
      //   return pactum
      //     .spec()
      //     .get('/tp/profile')
      //     .withHeaders({ Authorization: 'Bearer $S{tpAt}' })
      //     .expectStatus(200);
      // });
    });
    describe('Create an Application', () => {
      it('should return error if company is not authenticated', () => {
        return pactum.spec().post('/tp/application').expectStatus(401);
      });
      // it('should create an application', () => {});
    });
  });
  describe('User-Transaction party interaction', () => {
    describe('user signup on transaction party using the PCMA provider', () => {});
    describe('user access the services of a transaction party', () => {});
    describe('transaction party requesting for secret PII from user', () => {});
  });
  describe('User-Web crawling interaction', () => {});
});
