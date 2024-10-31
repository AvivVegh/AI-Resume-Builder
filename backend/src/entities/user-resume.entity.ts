import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_resume')
export class UserResumeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'resume' })
  resume: any;

  @Column({ name: 'job_description' })
  jobDescription: any;

  @Column({ default: true })
  deleted: boolean;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;
}
