import { Module } from '@nestjs/common';
import { ActivitiesController } from './controllers/activities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entities/activity';
import { ActivityCategory } from '../activity-categories/entities/activity-category';
import { ActivityCategoriesModule } from '../activity-categories/activity-categories.module';

@Module({
  controllers: [ActivitiesController],
  imports: [TypeOrmModule.forFeature([Activity, ActivityCategory])],
})
export class ActivitiesModule {}
