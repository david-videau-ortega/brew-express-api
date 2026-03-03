import { Module } from '@nestjs/common';
import { ActivityCategoriesController } from './controllers/activity-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityCategory } from './entities/activity-category';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityCategory])],
  controllers: [ActivityCategoriesController],
})
export class ActivityCategoriesModule {}
