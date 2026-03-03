/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Column,
  Entity,
  TreeChildren,
  TreeParent,
  BeforeInsert,
  PrimaryGeneratedColumn,
  Tree,
} from 'typeorm';

@Entity()
@Tree('closure-table')
export class ActivityCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @BeforeInsert()
  async setId(): Promise<void> {
    const { v7: uuidv7 } = await import('uuid');
    this.id = this.id || uuidv7();
  }

  @Column()
  name: string;

  @TreeChildren()
  children: ActivityCategory[];

  @TreeParent()
  parent: ActivityCategory;
}
