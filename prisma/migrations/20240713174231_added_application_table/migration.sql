-- CreateTable
CREATE TABLE "application" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "website_url" TEXT NOT NULL,
    "logo_url" TEXT NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "data_access" TEXT[],
    "secret_key" TEXT NOT NULL,
    "public_key" TEXT NOT NULL,

    CONSTRAINT "application_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "application" ADD CONSTRAINT "application_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "TransactionParty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
