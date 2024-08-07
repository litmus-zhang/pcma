/*
  Warnings:

  - The primary key for the `application` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[name]` on the table `application` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "UserApplication" DROP CONSTRAINT "UserApplication_applicationId_fkey";

-- AlterTable
ALTER TABLE "UserApplication" ALTER COLUMN "applicationId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "application" DROP CONSTRAINT "application_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "application_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "application_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "application_name_key" ON "application"("name");

-- AddForeignKey
ALTER TABLE "UserApplication" ADD CONSTRAINT "UserApplication_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
