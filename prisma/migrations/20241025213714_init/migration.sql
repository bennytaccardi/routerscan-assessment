-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL,
    "block_number" INTEGER NOT NULL,
    "tx_index" INTEGER NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "value" DECIMAL(30,0) NOT NULL,
    "gas_limit" INTEGER NOT NULL,
    "gas_used" INTEGER NOT NULL,
    "gas_price" DECIMAL(30,0) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);
