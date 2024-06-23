import { HttpStatus, Injectable } from '@nestjs/common';
import { UserRegisterDto } from 'src/auth/dto';
import { DatabaseService } from '../database/database.service';
import { ResponseStatus } from 'src/types/response.status';
import { CrawlerService } from 'src/crawler/crawler.service';

@Injectable()
export class UserService {
  constructor(
    private database: DatabaseService,
    private crawler: CrawlerService,
  ) {}
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
  async getAllDataLeaks(userId: number): Promise<ResponseStatus> {
    const user = await this.database.user.findUnique({
      where: { id: userId },
      select: { email: true, firstname: true, lastname: true },
    });
    const keywords = [user.email, user.firstname, user.lastname];
    const results = await this.crawler.searchForKeywords(
      'https://searxng.site/searxng/search',
      keywords,
    );
    // Get all data leaks on the internet
    return {
      message: 'Data leaks fetched successfully',
      status: HttpStatus.OK,
      data: results,
    };
  }
}
