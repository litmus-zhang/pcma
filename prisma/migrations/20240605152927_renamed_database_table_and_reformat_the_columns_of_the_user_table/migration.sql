/*
  Warnings:

  - You are about to drop the `ersonal_id` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "basic_pii" DROP CONSTRAINT "basic_pii_user_id_fkey";

-- DropForeignKey
ALTER TABLE "secret_pii" DROP CONSTRAINT "secret_pii_user_id_fkey";

-- DropTable
DROP TABLE "ersonal_id";

-- CreateTable
CREATE TABLE "personal_id" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "basic_piiUser_id" INTEGER,
    "secret_piiUser_id" INTEGER,

    CONSTRAINT "personal_id_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "personal_id_user_id_key" ON "personal_id"("user_id");

-- AddForeignKey
ALTER TABLE "personal_id" ADD CONSTRAINT "personal_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_id" ADD CONSTRAINT "personal_id_basic_piiUser_id_fkey" FOREIGN KEY ("basic_piiUser_id") REFERENCES "basic_pii"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_id" ADD CONSTRAINT "personal_id_secret_piiUser_id_fkey" FOREIGN KEY ("secret_piiUser_id") REFERENCES "secret_pii"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
