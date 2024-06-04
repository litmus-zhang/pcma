import { defineConfig } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';

export default defineConfig({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  driver: PostgreSqlDriver,
  clientUrl: process.env.DB_URL,
  extensions: [Migrator],
  migrations: {
    path: './migrations',
    emit: 'ts',
    tableName: 'mikro_orm_migrations',
  },
});
