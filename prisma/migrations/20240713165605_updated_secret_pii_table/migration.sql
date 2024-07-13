/*
  Warnings:

  - You are about to drop the column `address` on the `secret_pii` table. All the data in the column will be lost.
  - You are about to drop the column `ssn` on the `secret_pii` table. All the data in the column will be lost.
  - Added the required column `basic_pii_User_id` to the `secret_pii` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "secret_pii" DROP COLUMN "address",
DROP COLUMN "ssn",
ADD COLUMN     "basic_pii_User_id" INTEGER NOT NULL,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "dateOfBirth" TEXT,
ADD COLUMN     "homeAddress" TEXT,
ADD COLUMN     "occupation" TEXT,
ADD COLUMN     "phoneNumber" TEXT;

-- AddForeignKey
ALTER TABLE "secret_pii" ADD CONSTRAINT "secret_pii_basic_pii_User_id_fkey" FOREIGN KEY ("basic_pii_User_id") REFERENCES "basic_pii"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
