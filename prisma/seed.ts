import { PrismaClient } from "@prisma/client";
import fs from "fs";
import csv from "csv-parser";

const prisma = new PrismaClient();

interface Transaction {
  timestamp: Date;
  status: boolean;
  block_number: number;
  tx_index: number;
  from: string;
  to: string;
  value: string;
  gas_limit: number;
  gas_used: number;
  gas_price: string;
}

async function main() {
  const transactions: Transaction[] = [];

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream("./prisma/seed.csv")
      .pipe(csv())
      .on("data", (row) => {
        transactions.push({
          timestamp: new Date(row.timestamp),
          status: row.status === "TRUE",
          block_number: parseInt(row.block_number, 10),
          tx_index: parseInt(row.tx_index, 10),
          from: row.from,
          to: row.to,
          value: row.value,
          gas_limit: parseInt(row.gas_limit, 10),
          gas_used: parseInt(row.gas_used, 10),
          gas_price: row.gas_price,
        });
      })
      .on("end", () => {
        resolve();
      })
      .on("error", (error) => {
        reject(error);
      });
  });

  await prisma.transaction.createMany({
    // @ts-ignore
    data: transactions,
    skipDuplicates: true,
  });

  console.log("Database seeded successfully");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
