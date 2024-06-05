/*
  Warnings:

  - You are about to drop the column `type` on the `TransactionParty` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `email` to the `TransactionParty` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TransactionParty" DROP COLUMN "type",
ADD COLUMN     "email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "firstname" TEXT,
ADD COLUMN     "lastname" TEXT,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "transactionPartyId" INTEGER;

-- CreateTable
CREATE TABLE "ersonal_id" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "ersonal_id_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "basic_pii" (
    "user_id" INTEGER NOT NULL,
    "firstname" TEXT,
    "lastname" TEXT,
    "email" TEXT,

    CONSTRAINT "basic_pii_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "secret_pii" (
    "user_id" INTEGER NOT NULL,
    "ssn" TEXT,
    "address" TEXT,

    CONSTRAINT "secret_pii_pkey" PRIMARY KEY ("user_id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_transactionPartyId_fkey" FOREIGN KEY ("transactionPartyId") REFERENCES "TransactionParty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basic_pii" ADD CONSTRAINT "basic_pii_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "secret_pii" ADD CONSTRAINT "secret_pii_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
