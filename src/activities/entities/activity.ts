import { Column, Entity, BeforeInsert, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { ActivityCategory } from '../../activity-categories/entities/activity-category';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @BeforeInsert()
  async setId(): Promise<void> {
    const { v7: uuidv7 } = await import('uuid');
    this.id = this.id || uuidv7();
  }

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  imageUrl: string;

  @Column({ nullable: true })
  completedAt: Date; // Note: this should be linked to each specific user's completion status, not a single date for all users, so this property does not belong here. It should be moved to a separate entity that tracks user activity completion.

  @ManyToMany(() => ActivityCategory)
  @JoinTable()
  categories: ActivityCategory[];
}
