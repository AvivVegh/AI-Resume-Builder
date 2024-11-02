import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserResume1730394029773 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_resume" (
                "id" VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4(), 
                "user_id" varchar NOT NULL,
                "resume" JSONB NOT NULL,
                "deleted" boolean NOT NULL DEFAULT false,
                "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_resume"`);
  }
}
