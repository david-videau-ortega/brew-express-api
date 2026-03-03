import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ActivityCategory } from '../../../activity-categories/entities/activity-category';

@Injectable()
export class PostgresDatabaseConfiguration implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const production: boolean =
      this.configService.get<string>('NODE_ENV') === 'production';
    return {
      type: 'postgres',
      host: this.configService.get<string>('DATABASE_HOST'),
      port: this.configService.get<number>('DATABASE_PORT', 5432),
      username: this.configService.get<string>('DATABASE_USER'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      database: this.configService.get<string>('DATABASE_NAME'),
      entities: [ActivityCategory],
      synchronize: !production,
    };
  }
}
