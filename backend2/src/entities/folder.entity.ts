import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Role {
  SG_AssetMgr_User = 'SG_AssetMgr_User',
  SG_AssetMgr_DeptHead = 'SG_AssetMgr_DeptHead',
  SG_AssetMgr_TechAdmin = 'SG_AssetMgr_TechAdmin',
}

@Entity('folder')
export class Folder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({
    name: 'path',
  })
  path: string;

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({ name: 'deleted_by' })
  deleteBy: string;

  @Column({ name: 'can_delete', type: 'enum', enum: Role, array: true })
  canDelete: Role[];

  @Column({ name: 'can_create_folder', type: 'enum', enum: Role, array: true })
  canCreateFolder: Role[];

  @Column({ name: 'deleted' })
  deleted: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
