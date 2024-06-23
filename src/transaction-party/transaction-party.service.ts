import { HttpStatus, Injectable } from '@nestjs/common';
import { CompanyRegisterDto } from '../auth/dto';
import { DatabaseService } from '../database/database.service';
import { ResponseStatus } from '../types/response.status';

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
}
