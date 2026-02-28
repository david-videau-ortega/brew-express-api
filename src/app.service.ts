import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  getEnvironment(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }

  async getTimestamp(): Promise<number> {
    const timestamp =
      await this.dataSource.query<Array<{ now: number }>>('SELECT NOW()');
    return timestamp[0].now;
  }
}
