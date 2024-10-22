import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAssetsTable1716319015965 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE assets (
                id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                file_name VARCHAR,
                file_path VARCHAR,
                user_email VARCHAR, 
                url VARCHAR, 
                short_url VARCHAR, 
                bitly_id VARCHAR,
                content_type VARCHAR,
                size FLOAT,
                created_by UUID,
                created_at TIMESTAMP WITH TIME ZONE
            );`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP TABLE assets;`,
        )
    }

}
