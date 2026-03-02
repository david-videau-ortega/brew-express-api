import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityCategory } from '../entities/activity-category';
import { DataSource, Repository } from 'typeorm';
import type { CreateActivityCategoryDto } from '../entities/create-activity-category-dto';

@Controller('activity-categories')
export class ActivityCategoriesController {
  constructor(
    @InjectRepository(ActivityCategory)
    private activityCategoriesRepository: Repository<ActivityCategory>,
    private readonly dataSource: DataSource,
  ) {}

  @Post()
  async create(@Body() category: CreateActivityCategoryDto) {
    let parent: ActivityCategory = null;
    if (category.parentId) {
      parent = await this.activityCategoriesRepository.findOne({
        where: { id: category.parentId },
      });
    }
    const activityCategory = this.activityCategoriesRepository.create({
      ...category,
      parent,
    });
    return await this.activityCategoriesRepository.save(activityCategory);
  }

  @Get()
  async findAll() {
    return await this.activityCategoriesRepository.find({
      loadRelationIds: true,
      relationLoadStrategy: 'query',
    });
  }

  @Get(':id')
  async findOne(@Param('id') categoryId: string) {
    return await this.activityCategoriesRepository.findOne({
      where: { id: categoryId },
      loadRelationIds: true,
      relationLoadStrategy: 'query',
    });
  }

  @Get(':id/children')
  async findTree(@Param('id') id: string) {
    return await this.dataSource.manager
      .getTreeRepository(ActivityCategory)
      .findBy({ parent: { id } });
  }

  @Delete(':id')
  async delete(@Param('id') categoryId: string) {
    return await this.activityCategoriesRepository.delete({ id: categoryId });
  }
}
