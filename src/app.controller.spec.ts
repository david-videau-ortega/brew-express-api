import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: DataSource,
          useValue: {
            query: jest.fn().mockResolvedValue([{ now: 123 }]),
          },
        },
      ],
    }).compile();
  });

  describe('getHello', () => {
    it('should include the test environment string', async () => {
      const appController = app.get(AppController);
      const result = await appController.getEnvironment();
      expect(result).toContain('Environment: test');
    });
  });
});
