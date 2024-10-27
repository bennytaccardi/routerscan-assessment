import { createPublicClient, http, parseTransaction } from "viem";
import { avalanche } from "viem/chains";
import { setTimeout } from "timers/promises";
import { Decimal } from "@prisma/client/runtime/library";
import { appContext } from "../appContext";

export default class TransactionMonitor {
  private lastProcessedBlock: bigint;
  private isProcessing: boolean = false;
  private readonly BLOCK_BATCH_SIZE = 10;
  private readonly RETRY_DELAY = 5000;
  private readonly BLOCK_PROCESS_DELAY = 1000;
  private client: any;

  constructor() {
    this.lastProcessedBlock = 0n;
    this.client = createPublicClient({
      chain: avalanche,
      transport: http("https://api.avax.network/ext/bc/C/rpc"),
    });
  }

  async initialize() {
    this.lastProcessedBlock = await this.client.getBlockNumber();
    console.log(`Starting from block ${this.lastProcessedBlock}`);
  }

  async start() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      while (this.isProcessing) {
        await this.processNewBlocks();
        await setTimeout(this.BLOCK_PROCESS_DELAY);
      }
    } catch (error) {
      console.error("Error in monitoring process:", error);
      this.isProcessing = false;
      await setTimeout(this.RETRY_DELAY);
      this.start();
    }
  }

  async stop() {
    this.isProcessing = false;
  }

  async processNewBlocks() {
    const currentBlock = await this.client.getBlockNumber();

    if (currentBlock <= this.lastProcessedBlock) {
      return;
    }

    const startBlock = this.lastProcessedBlock + 1n;
    const endBlock = BigInt(
      Math.min(Number(startBlock) + this.BLOCK_BATCH_SIZE, Number(currentBlock))
    );

    console.log(`Processing blocks ${startBlock} to ${endBlock}`);

    const blocks = await Promise.all(
      Array.from(
        { length: Number(endBlock - startBlock) + 1 },
        async (_, i) => {
          const blockNumber = startBlock + BigInt(i);
          const block = await this.client.getBlock({
            blockNumber,
            includeTransactions: true,
          });

          const receipts = await Promise.all(
            block.transactions.map((tx: { hash: any }) =>
              this.client.getTransactionReceipt({
                hash: typeof tx === "string" ? tx : tx.hash,
              })
            )
          );

          return { block, receipts };
        }
      )
    );

    for (const { block, receipts } of blocks) {
      if (!block.transactions) continue;

      const transactions = block.transactions.map(
        (
          tx: {
            transactionIndex: any;
            from: string;
            to: string;
            value: { toString: () => Decimal.Value };
            gas: any;
            gasPrice: { toString: () => any };
          },
          index: string | number
        ) => {
          if (typeof tx === "string") {
            throw new Error("Expected full transaction object");
          }

          // @ts-ignore
          const receipt = receipts[index];
          const status = receipt.status === "success";

          return {
            timestamp: new Date(Number(block.timestamp) * 1000),
            status,
            block_number: Number(block.number),
            tx_index: Number(tx.transactionIndex),
            from: tx.from.toLowerCase(),
            to: tx.to?.toLowerCase() ?? "",
            value: new Decimal(tx.value.toString()),
            gas_limit: Number(tx.gas),
            gas_used: Number(receipt.gasUsed),
            gas_price: new Decimal(tx.gasPrice?.toString() ?? "0"),
          };
        }
      );

      if (transactions.length > 0) {
        await appContext.service.trxService.saveTransactions(transactions);
      }
    }

    this.lastProcessedBlock = endBlock;
  }
}
