import { Module } from '@nestjs/common';
import { PostgresDatabaseConfiguration } from './configurations/postgres/postgres-database-configuration';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: PostgresDatabaseConfiguration,
    }),
  ],
})
export class DatabaseModule {}
