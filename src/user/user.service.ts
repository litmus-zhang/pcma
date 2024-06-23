import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  editMe(userId: string, data: any) {
    // return user;
    console.log(userId, data);
  }
}
