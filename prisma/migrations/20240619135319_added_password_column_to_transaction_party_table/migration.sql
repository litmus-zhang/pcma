/*
  Warnings:

  - Added the required column `password` to the `TransactionParty` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TransactionParty" ADD COLUMN     "password" TEXT NOT NULL;
