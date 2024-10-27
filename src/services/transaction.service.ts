import { prisma } from "../db/client";
import { Transaction } from "../entities/transaction";
import { PaginatedResponse } from "../types/responses";

export default class TransactionService {
  public async getAllTransactionByAddress(
    referenceAddress: string
  ): Promise<Transaction[]> {
    const result: Transaction[] = await prisma.transaction.findMany({
      where: {
        OR: [
          {
            from: referenceAddress,
          },
          {
            to: referenceAddress,
          },
        ],
      },
      orderBy: [
        {
          block_number: "desc",
        },
        {
          tx_index: "desc",
        },
      ],
    });
    return result;
  }

  public async getNumberOfTransactionByAddress(
    referenceAddress: string
  ): Promise<number> {
    return prisma.transaction.count({
      where: {
        OR: [
          {
            from: referenceAddress,
          },
          {
            to: referenceAddress,
          },
        ],
      },
    });
  }

  public async getAllTrxs(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Transaction>> {
    const totalItems = await prisma.transaction.count();

    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(totalItems / limit);
    const transactions = await prisma.transaction.findMany({
      orderBy: {
        value: "desc",
      },
      skip,
      take: limit,
    });
    return {
      data: transactions,
      metadata: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
      },
    };
  }

  public async saveTransactions(transactions: Transaction[]) {
    try {
      await prisma.transaction.createMany({
        data: transactions.map((tx) => ({
          timestamp: tx.timestamp,
          status: tx.status,
          block_number: tx.block_number,
          tx_index: tx.tx_index,
          from: tx.from,
          to: tx.to,
          value: tx.value,
          gas_limit: tx.gas_limit,
          gas_used: tx.gas_used,
          gas_price: tx.gas_price,
        })),
        skipDuplicates: true,
      });
      console.log(`Saved ${transactions.length} transactions`);
    } catch (error) {
      console.error("Error saving transactions:", error);
      throw error;
    }
  }
}
