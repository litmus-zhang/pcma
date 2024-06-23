import { HttpStatus, Injectable } from '@nestjs/common';
import { UserRegisterDto } from 'src/auth/dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
  constructor(private database: DatabaseService) {}
  async editMe(userId: number, data: UserRegisterDto) {
    try {
      const result = await this.database.user.update({
        where: { id: userId },
        data,
      });
      delete result.password;
      return {
        message: 'User profile updated successfully',
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
