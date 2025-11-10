-- CreateTable
CREATE TABLE "Ship" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "cb" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bankedCB" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Ship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankingRecord" (
    "id" TEXT NOT NULL,
    "shipId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BankingRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BankingRecord" ADD CONSTRAINT "BankingRecord_shipId_fkey" FOREIGN KEY ("shipId") REFERENCES "Ship"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
