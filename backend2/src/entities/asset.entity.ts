import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'file_name',
  })
  fileName: string;

  @Column({
    name: 'file_path',
  })
  filePath: string;

  @Column({ name: 'url' })
  url: string;

  @Column({ name: 'short_url' })
  shortUrl: string;

  @Column({ name: 'bitly_id' })
  bitlyId: string;

  @Column({ name: 'user_email' })
  userEmail: string;

  @Column({ name: 'content_type', length: 250 })
  contentType: string;

  @Column({ name: 'size' })
  size: number;

  @Column({ type: 'uuid', name: 'created_by', nullable: true })
  createdBy: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
