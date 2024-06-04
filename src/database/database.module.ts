import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from '../../mikro-orm.config';
@Global()
@Module({
  providers: [DatabaseService],
  imports: [MikroOrmModule.forRoot(config)],
})
export class DatabaseModule {}
