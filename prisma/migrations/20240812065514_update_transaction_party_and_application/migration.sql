-- AlterTable
ALTER TABLE "TransactionParty" ADD COLUMN     "companyAddress" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "registrationNumber" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "application" ADD COLUMN     "purpose_of_access" TEXT;
