import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import TransactionService from "../../src/services/transaction.service";
import { Transaction } from "../../src/entities/transaction";
import { prisma } from "../../src/db/client";
import { Decimal } from "@prisma/client/runtime/library";
import { getBlockNumber } from "viem/_types/actions/public/getBlockNumber";

vi.mock("../db/client", () => ({
  prisma: {
    transaction: {
      findMany: vi.fn(),
      count: vi.fn(),
      createMany: vi.fn(),
    },
  },
}));

describe("TransactionService", () => {
  let service: TransactionService;

  const mockTransactions: Transaction[] = [
    {
      timestamp: new Date(),
      status: true,
      block_number: 123,
      tx_index: 0,
      from: "0x123",
      to: "0x456",
      value: new Decimal("1000000000000000000"),
      gas_limit: 21000,
      gas_used: 21000,
      gas_price: new Decimal("1000000000"),
    },
    {
      timestamp: new Date(),
      status: true,
      block_number: 124,
      tx_index: 1,
      from: "0x789",
      to: "0x123",
      value: new Decimal("2000000000000000000"),
      gas_limit: 21000,
      gas_used: 21000,
      gas_price: new Decimal("1000000000"),
    },
  ];

  const mockTransactionsWithId: (Transaction & { id: number })[] =
    mockTransactions.map((tx, index) => ({
      ...tx,
      id: index + 1,
    }));
  beforeEach(() => {
    service = new TransactionService();
    vi.clearAllMocks();
  });

  describe("getAllTransactionByAddress", () => {
    it("should return all transactions for a given address", async () => {
      const referenceAddress = "0x123";
      vi.spyOn(prisma.transaction, "findMany").mockResolvedValueOnce(
        mockTransactionsWithId
      );

      const result = await service.getAllTransactionByAddress(referenceAddress);

      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        where: {
          OR: [{ from: referenceAddress }, { to: referenceAddress }],
        },
        orderBy: [{ block_number: "desc" }, { tx_index: "desc" }],
      });
      expect(result).toEqual(mockTransactionsWithId);
    });

    it("should return empty array when no transactions found", async () => {
      const referenceAddress = "0xnonexistent";
      vi.spyOn(prisma.transaction, "findMany").mockResolvedValueOnce([]);

      const result = await service.getAllTransactionByAddress(referenceAddress);

      expect(result).toEqual([]);
    });
  });

  describe("getNumberOfTransactionByAddress", () => {
    it("should return the count of transactions for a given address", async () => {
      const referenceAddress = "0x123";
      const expectedCount = 2;
      vi.spyOn(prisma.transaction, "count").mockResolvedValueOnce(
        expectedCount
      );

      const result = await service.getNumberOfTransactionByAddress(
        referenceAddress
      );

      expect(prisma.transaction.count).toHaveBeenCalledWith({
        where: {
          OR: [{ from: referenceAddress }, { to: referenceAddress }],
        },
      });
      expect(result).toBe(expectedCount);
    });
  });

  describe("getAllTrxs", () => {
    it("should return paginated transactions with metadata", async () => {
      const page = 1;
      const limit = 10;
      const totalItems = 15;

      vi.spyOn(prisma.transaction, "count").mockResolvedValueOnce(totalItems);
      vi.spyOn(prisma.transaction, "findMany").mockResolvedValueOnce(
        mockTransactionsWithId
      );

      const result = await service.getAllTrxs(page, limit);

      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        orderBy: { value: "desc" },
        skip: 0,
        take: limit,
      });
      expect(result).toEqual({
        data: mockTransactionsWithId,
        metadata: {
          currentPage: page,
          totalPages: 2,
          totalItems,
          itemsPerPage: limit,
        },
      });
    });

    it("should use default pagination values when not provided", async () => {
      vi.spyOn(prisma.transaction, "count").mockResolvedValueOnce(5);
      vi.spyOn(prisma.transaction, "findMany").mockResolvedValueOnce(
        mockTransactionsWithId
      );

      await service.getAllTrxs();

      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        orderBy: { value: "desc" },
        skip: 0,
        take: 10,
      });
    });
  });

  describe("saveTransactions", () => {
    it("should successfully save transactions", async () => {
      vi.spyOn(prisma.transaction, "createMany").mockResolvedValueOnce({
        count: mockTransactions.length,
      });
      const consoleSpy = vi.spyOn(console, "log");

      await service.saveTransactions(mockTransactions);

      expect(prisma.transaction.createMany).toHaveBeenCalledWith({
        data: mockTransactions.map((tx) => ({
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
      expect(consoleSpy).toHaveBeenCalledWith(
        `Saved ${mockTransactions.length} transactions`
      );
    });

    it("should handle errors when saving transactions", async () => {
      const error = new Error("Database error");
      vi.spyOn(prisma.transaction, "createMany").mockRejectedValue(error);
      const consoleSpy = vi.spyOn(console, "error");

      await expect(service.saveTransactions(mockTransactions)).rejects.toThrow(
        error
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error saving transactions:",
        error
      );
    });
  });
});
