import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getEnvironment(): Promise<string> {
    const timestamp = await this.appService.getTimestamp();
    const environment = this.appService.getEnvironment();
    return `Environment: ${environment} - Database Time: ${timestamp}`;
  }
}
