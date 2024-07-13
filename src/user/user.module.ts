import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CrawlerModule } from '../crawler/crawler.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [CrawlerModule],
})
export class UserModule {}
