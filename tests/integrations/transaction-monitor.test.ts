vi.mock("viem", async () => {
  const actual = await vi.importActual("viem");

  const getBlockNumber = vi
    .fn()
    .mockResolvedValueOnce(0n)
    .mockResolvedValueOnce(1n)
    .mockResolvedValueOnce(2n);

  const getBlock = vi.fn().mockImplementation(async ({ blockNumber }) => {
    if (blockNumber === 1n) {
      return {
        number: 1n,
        timestamp: 1000n,
        transactions: [
          {
            hash: "0x123",
            from: "0xABC",
            to: "0xDEF",
            value: { toString: () => "1000000" },
            gas: 21000n,
            gasPrice: { toString: () => "20000000000" },
            transactionIndex: 0,
          },
        ],
      };
    }
    return {
      number: 2n,
      timestamp: 1001n,
      transactions: [
        {
          hash: "0x456",
          from: "0xGHI",
          to: "0xJKL",
          value: { toString: () => "2000000" },
          gas: 21000n,
          gasPrice: { toString: () => "20000000000" },
          transactionIndex: 0,
        },
      ],
    };
  });

  const getTransactionReceipt = vi.fn().mockResolvedValue({
    status: "success",
    gasUsed: 21000n,
  });

  return {
    ...actual,
    createPublicClient: () => ({
      account: undefined,
      batch: undefined,
      cacheTime: 0,
      chain: { id: 43114, name: "Avalanche" },
      key: "public",
      name: "Public Client",
      pollingInterval: 4000,
      request: vi.fn(),
      transport: { type: "http", url: "https://api.avax.network/ext/bc/C/rpc" },
      type: "publicClient",
      uid: "public",
      getBlockNumber,
      getBlock,
      getTransactionReceipt,
    }),
  };
});

import { describe, it, vi, expect, beforeEach } from "vitest";
import { setTimeout } from "timers/promises";
import type { PublicClient } from "viem";
import * as viem from "viem";
import { appContext } from "../../src/appContext";
import { avalanche } from "viem/chains";

describe("TransactionMonitor Integration Tests", () => {
  let client: PublicClient;

  beforeEach(() => {
    vi.clearAllMocks();
    client = viem.createPublicClient({
      chain: avalanche,
      transport: viem.http("https://api.avax.network/ext/bc/C/rpc"),
    });
  });

  it("should process blocks and save transactions", async () => {
    await appContext.service.trxMonitor.initialize();
    const processPromise = appContext.service.trxMonitor.start();

    await setTimeout(1000);

    await appContext.service.trxMonitor.stop();
    await processPromise;

    expect(client.getBlockNumber).toHaveBeenCalled();
    expect(client.getBlock).toHaveBeenCalled();
    expect(client.getTransactionReceipt).toHaveBeenCalled();
  }, 10000);

  it("should retry processing on error", async () => {
    const processNewBlocksSpy = vi.spyOn(
      appContext.service.trxMonitor,
      "processNewBlocks"
    );
    processNewBlocksSpy.mockRejectedValueOnce(new Error("Test Error"));

    await appContext.service.trxMonitor.start();
    await setTimeout(5100);

    expect(processNewBlocksSpy).toHaveBeenCalledTimes(3);
    processNewBlocksSpy.mockRestore();
  }, 20000);

  it("should correctly map and save transaction data", async () => {
    const saveTransactionsSpy = vi.spyOn(
      appContext.service.trxService,
      "saveTransactions"
    );

    await appContext.service.trxMonitor.processNewBlocks();

    expect(saveTransactionsSpy).toHaveBeenCalled();

    saveTransactionsSpy.mockRestore();
  });
});
