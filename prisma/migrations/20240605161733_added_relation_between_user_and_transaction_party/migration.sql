/*
  Warnings:

  - You are about to drop the column `transactionPartyId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_transactionPartyId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "transactionPartyId";

-- CreateTable
CREATE TABLE "UserTransactionParty" (
    "userId" INTEGER NOT NULL,
    "transactionPartyId" INTEGER NOT NULL,

    CONSTRAINT "UserTransactionParty_pkey" PRIMARY KEY ("userId","transactionPartyId")
);

-- AddForeignKey
ALTER TABLE "UserTransactionParty" ADD CONSTRAINT "UserTransactionParty_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTransactionParty" ADD CONSTRAINT "UserTransactionParty_transactionPartyId_fkey" FOREIGN KEY ("transactionPartyId") REFERENCES "TransactionParty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
