import { Test, TestingModule } from '@nestjs/testing';
import { ActivityCategoriesController } from './activity-categories.controller';

describe('ActivityCategoriesController', () => {
  let controller: ActivityCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityCategoriesController],
    }).compile();

    controller = module.get<ActivityCategoriesController>(
      ActivityCategoriesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
