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
}
