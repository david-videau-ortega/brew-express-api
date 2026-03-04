import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from '../entities/activity';
import { DataSource, In, Repository } from 'typeorm';
import { ActivityCategory } from '../../activity-categories/entities/activity-category';

@Controller('activities')
export class ActivitiesController {
  constructor(
    @InjectRepository(Activity)
    private readonly activitiesRepository: Repository<Activity>,
    @InjectRepository(ActivityCategory)
    private readonly activityCategoriesRepository: Repository<ActivityCategory>,
    private readonly datasource: DataSource,
  ) {}

  @Post()
  async createActivity(@Body() activity: any): Promise<void> {
    // Allow creating activities by passing category IDs instead of full entities.
    // If `activity.categories` is an array of ids, map them to objects with `{ id }`
    // so TypeORM will create the relation without loading the full entities.
    const categories = Array.isArray(activity?.categories)
      ? activity.categories.map((id: string) => ({ id }))
      : activity?.categories;
    const newActivity = this.activitiesRepository.create({
      ...activity,
      categories,
    });
    const saved = await this.activitiesRepository.save(newActivity);
    console.log(saved);
  }

  @Patch(':id')
  async updateActivity(@Param('id') id: string, @Body() activity: any): Promise<void> {
    const { categories, ...rest } = activity ?? {};

    const existing = await this.activitiesRepository.findOne({
      where: { id },
      relations: ['categories'],
    });

    if (!existing) return;


    // Resolve provided categories (assumed array of ids) to actual entities
    if (categories !== undefined) {
      if (Array.isArray(categories)) {
        const cats = await this.activityCategoriesRepository
          .createQueryBuilder('cat')
          .where('cat.id IN (:...ids)', { ids: categories })
          .getMany();
        existing.categories = cats;
      } else {
        existing.categories = categories;
      }
    }

    // Normalize unix timestamps (seconds or milliseconds) to Date objects
    if (rest.completedAt !== undefined) {
      const raw = rest.completedAt;
      if (typeof raw === 'number' || (typeof raw === 'string' && /^\d+$/.test(raw))) {
        let num = Number(raw);
        // If value looks like seconds (10 digits), convert to ms
        if (num < 1e12) num = num * 1000;
        rest.completedAt = new Date(num);
      } else {
        rest.completedAt = new Date(raw);
      }
    }

    Object.assign(existing, rest);
    await this.activitiesRepository.save(existing);
  }

  @Get()
  async getAllActivities(
    @Query('category') categoriesQuery: string | string[] | undefined,
  ): Promise<Activity[]> {
    const categoryIds =
      typeof categoriesQuery === 'string' ? [categoriesQuery] : categoriesQuery;
    return await this.activitiesRepository.find({
      loadRelationIds: true,
      relationLoadStrategy: 'query',
      where: categoryIds ? { categories: { id: In(categoryIds) } } : {},
    });
  }

  @Get(':id')
  async getActivityById(@Param('id') id: string): Promise<Activity> {
    return this.activitiesRepository.findOne(
      { where: { id }, loadRelationIds: true }
    );
  }

  @Delete(':id')
  async deleteActivity(@Param('id') id: string): Promise<void> {
    await this.activitiesRepository.delete(id);
  }
}
