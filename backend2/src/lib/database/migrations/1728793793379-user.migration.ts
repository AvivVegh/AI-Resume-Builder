import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1728793793379 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" (
              "id" VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4(), 
              "first_name" varchar NOT NULL,
              "last_name" varchar NOT NULL,
              "email" varchar NOT NULL,
              provider_id varchar NOT NULL,
              provider_type varchar NOT NULL,
              "deleted" boolean NOT NULL DEFAULT false,
              "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
          );
          `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
