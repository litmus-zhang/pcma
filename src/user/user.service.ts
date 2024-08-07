import { HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ResponseStatus } from 'src/types/response.status';
import { CrawlerService } from '../crawler/crawler.service';
import { UserBasicPiiDto, UserSensitivePiiDto, UserUpdateDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    private database: DatabaseService,
    private crawler: CrawlerService,
  ) {}
  async editMe(userId: number, data: UserUpdateDto): Promise<ResponseStatus> {
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
  async setBasicPII(
    userId: number,
    data: UserBasicPiiDto,
  ): Promise<ResponseStatus> {
    try {
      const result = await this.database.basic_pii.create({
        data: {
          user_id: userId,
          firstname: data.firstName,
          lastname: data.lastName,
          email: data.email,
        },
      });
      return {
        message: 'User Basic PII updated successfully',
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
  async setSensitivePII(
    userId: number,
    data: UserSensitivePiiDto,
  ): Promise<ResponseStatus> {
    try {
      const result = await this.database.secret_pii.create({
        data: {
          user_id: userId,
          country: data.country || 'Nigeria',
          dateOfBirth: String(data.dateOfBirth),
          homeAddress: data.homeAddress,
          occupation: data.occupation,
          phoneNumber: data.phoneNumber,
          basic_pii_User_id: userId,
        },
      });
      return {
        message: 'User Personal PII updated successfully',
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

  async getDashboard(userId: number): Promise<ResponseStatus> {
    try {
      const data = await this.database.user_tp_request.findMany({
        where: {
          id: userId,
        },
      });
      // get the application the users have signed up to
      const userApplications = await this.database.user.findUnique({
        where: { id: userId },
        select: {
          userApplications: true,
        },
        // include: {
        //   userApplications: {
        //     include: {
        //       application: true,
        //     },
        //   },
        // },
      });
      const checkIfPIIIsSet = await Promise.allSettled([
        this.database.basic_pii.findUnique({
          where: {
            user_id: userId,
          },
        }),
        this.database.secret_pii.findUnique({
          where: {
            user_id: userId,
          },
        }),
      ]);

      const result = await this.sortDashboardData(data);
      if (checkIfPIIIsSet[0] && checkIfPIIIsSet[1]) {
        result['basic_pii_saved'] = false;
        result['secret_pii_saved'] = false;
      } else {
        result['basic_pii_saved'] = true;
        result['secret_pii_saved'] = true;
      }
      result['connected_applications'] = userApplications['userApplications'];
      return {
        message: 'User dashboard data fetched successfully',
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
  async sortDashboardData(data: any): Promise<object> {
    // get all request count by type
    // get all request count by status
    // get all request
    const requestStatusCount = data.reduce((acc, curr) => {
      if (!acc[curr.status]) {
        acc[curr.status] = 0;
      }
      acc[curr.status]++;
      return acc;
    }, {});
    return {
      request: {
        pending: requestStatusCount['pending'] || 0,
        approved: requestStatusCount['approved'] || 0,
        revoked: requestStatusCount['revoked'] || 0,
        data_leaks: requestStatusCount['data_leaks'] || 0,
      },
      activities: {
        total: data.length,
        data: data,
      },
    };
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
