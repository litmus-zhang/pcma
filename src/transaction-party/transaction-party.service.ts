import { HttpStatus, Injectable } from '@nestjs/common';
import { CompanyRegisterDto } from '../auth/dto';
import { DatabaseService } from '../database/database.service';
import { ResponseStatus } from '../types/response.status';
import { createHash } from 'crypto';
import { ulid } from 'ulid';

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
      const application = await this.database.application.findFirst({
        where: {
          name: dto.name,
        },
      });
      if (application) {
        return {
          message: 'Application name already exists, use another name',
          status: HttpStatus.BAD_REQUEST,
        };
      }
      const id = ulid();
      const { secretKey, publicKey } = await this.generateKeyPairAsync();
      const result = await this.database.application.create({
        data: {
          id,
          ...dto,
          createdBy: transactionPartyId,
          public_key: publicKey,
          secret_key: secretKey,
        },
        select: {
          secret_key: true,
          public_key: true,
          id: true,
        },
      });
      // use the ulid to generate the scret key anb public key
      // return the secret key , public key and application id to the user
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

  async generateKeyPairAsync(applicationId?: string): Promise<{
    secretKey: string;
    publicKey: string;
  }> {
    const secretKey = createHash('sha256')
      .update(applicationId + 'secret')
      .digest('hex');
    const publicKey = createHash('sha256')
      .update(applicationId + 'private')
      .digest('hex');
    return {
      secretKey,
      publicKey,
    };
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
