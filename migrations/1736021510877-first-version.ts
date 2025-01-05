import type { MigrationInterface, QueryRunner } from 'typeorm';

export class FirstVersion1736021510877 implements MigrationInterface {
  name = 'FirstVersion1736021510877';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "session_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "accessToken" character varying NOT NULL, "refreshToken" character varying NOT NULL, "ip" character varying NOT NULL, "userAgent" character varying NOT NULL, "deletedAt" TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_897bc09b92e1a7ef6b30cba4786" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email"), CONSTRAINT "UQ_9b998bada7cff93fcb953b0c37e" UNIQUE ("username"), CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "blocks" jsonb NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "authorId" uuid, CONSTRAINT "PK_58a149c4e88bf49036bc4c8c79f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "session_entity" ADD CONSTRAINT "FK_8118675718bebb455bba4caf129" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_entity" ADD CONSTRAINT "FK_6fbc92fc8a38f75ffe91acd93a8" FOREIGN KEY ("authorId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_entity" DROP CONSTRAINT "FK_6fbc92fc8a38f75ffe91acd93a8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "session_entity" DROP CONSTRAINT "FK_8118675718bebb455bba4caf129"`,
    );
    await queryRunner.query(`DROP TABLE "post_entity"`);
    await queryRunner.query(`DROP TABLE "user_entity"`);
    await queryRunner.query(`DROP TABLE "session_entity"`);
  }
}
