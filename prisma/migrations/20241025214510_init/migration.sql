/*
  Warnings:

  - A unique constraint covering the columns `[block_number,tx_index]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Transaction_from_block_number_tx_index_idx" ON "Transaction"("from", "block_number", "tx_index");

-- CreateIndex
CREATE INDEX "Transaction_to_block_number_tx_index_idx" ON "Transaction"("to", "block_number", "tx_index");

-- CreateIndex
CREATE INDEX "Transaction_value_idx" ON "Transaction"("value" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_block_number_tx_index_key" ON "Transaction"("block_number", "tx_index");
