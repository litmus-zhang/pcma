-- CreateTable
CREATE TABLE "user_tp_request" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "transactionPartyId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "activity" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_tp_request_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_tp_request" ADD CONSTRAINT "user_tp_request_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tp_request" ADD CONSTRAINT "user_tp_request_transactionPartyId_fkey" FOREIGN KEY ("transactionPartyId") REFERENCES "TransactionParty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
