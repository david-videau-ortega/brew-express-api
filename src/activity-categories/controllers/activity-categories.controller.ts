import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityCategory } from '../entities/activity-category';
import { Repository } from 'typeorm';

@Controller('activity-categories')
export class ActivityCategoriesController {
  constructor(
    @InjectRepository(ActivityCategory)
    private activityCategoriesRepository: Repository<ActivityCategory>,
  ) {}

  @Post()
  async create(@Body() category: ActivityCategory) {
    const activityCategory = this.activityCategoriesRepository.create(category);
    return await this.activityCategoriesRepository.save(activityCategory);
  }

  @Get()
  async findAll() {
    return await this.activityCategoriesRepository.find({
      loadRelationIds: true,
      relationLoadStrategy: 'query',
    });
  }

  @Delete(':id')
  async delete(@Param('id') categoryId: string) {
    return await this.activityCategoriesRepository.delete({ id: categoryId });
  }

}
