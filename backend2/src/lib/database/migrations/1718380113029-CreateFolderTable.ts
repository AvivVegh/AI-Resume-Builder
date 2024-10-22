import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFolderTable1718380113029 implements MigrationInterface {
    name = 'CreateFolderTable1718380113029'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
            CREATE TYPE Role AS ENUM ('SG_AssetMgr_User', 'SG_AssetMgr_DeptHead', 'SG_AssetMgr_TechAdmin');

            CREATE TABLE folder (
                id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR,
                path VARCHAR,
                created_by VARCHAR,
                deleted_by VARCHAR,
                can_delete Role[],
                can_create_folder Role[],                
                deleted BOOLEAN DEFAULT FALSE,                
                created_at TIMESTAMP WITH TIME ZONE
            );

            CREATE INDEX idx_folder_name_path_deleted ON folder(name,path,deleted);
            `,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
            DROP TABLE folder;
            DROP TYPE Role;            
            `,
        )
    }

}
