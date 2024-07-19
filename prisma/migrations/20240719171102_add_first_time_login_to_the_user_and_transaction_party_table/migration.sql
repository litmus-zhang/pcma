-- AlterTable
ALTER TABLE "TransactionParty" ADD COLUMN     "firstTimeLogin" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "firstTimeLogin" BOOLEAN NOT NULL DEFAULT true;
