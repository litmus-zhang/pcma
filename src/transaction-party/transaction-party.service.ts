import { HttpStatus, Injectable } from '@nestjs/common';
import { CompanyRegisterDto } from '../auth/dto';
import { DatabaseService } from '../database/database.service';
import { ResponseStatus } from '../types/response.status';
import { generateKeyPair } from 'crypto';

@Injectable()
export class TransactionPartyService {
  constructor(private database: DatabaseService) {}
  async editMe(
    userId: number,
    data: CompanyRegisterDto,
  ): Promise<ResponseStatus> {
    try {
      const result = await this.database.transactionParty.update({
        where: { id: userId },
        data,
      });
      delete result.password;
      return {
        message: 'Company profile updated successfully',
        data: result,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async createApplication(transactionPartyId, dto): Promise<ResponseStatus> {
    try {
      const keyPair = await this.generateKeyPairAsync();
      const result = await this.database.application.create({
        data: {
          ...dto,
          createdBy: transactionPartyId,
          public_key: keyPair.publicKey,
          private_key: keyPair.privateKey,
        },
      });
      return {
        message: 'Application created successfully',
        data: result,
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      return {
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }
  async getDashboard(transactionPartyId: number): Promise<ResponseStatus> {
    try {
      const result = await this.database.application.findMany({
        where: {
          createdBy: transactionPartyId,
        },
        select: {
          id: true,
          name: true,
          logo_url: true,
          website_url: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return {
        message: 'Dashboard fetched successfully',
        data: result,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async generateKeyPairAsync(): Promise<{
    publicKey: string;
    privateKey: string;
  }> {
    return new Promise((resolve, reject) => {
      generateKeyPair(
        'rsa',
        {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
          },
          privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
          },
        },
        (err, publicKey, privateKey) => {
          if (err) {
            return reject(err);
          }
          resolve({ publicKey, privateKey });
        },
      );
    });
  }

  async getApplications(transactionPartyId: number): Promise<ResponseStatus> {
    try {
      const result = await this.database.application.findMany({
        where: {
          createdBy: transactionPartyId,
        },
        select: {
          id: true,
          name: true,
          logo_url: true,
          website_url: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return {
        message: 'Applications fetched successfully',
        data: result,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }
}
