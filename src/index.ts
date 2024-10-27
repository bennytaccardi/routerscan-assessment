import Fastify from "fastify";
import transactionRoutes from "./routes/transaction";
import { appContext } from "./appContext";
import { prisma } from "./db/client";

async function initializeMonitor() {
  try {
    await appContext.service.trxMonitor.initialize();
    await appContext.service.trxMonitor.start();
    console.log("Transaction monitor started successfully");
  } catch (error) {
    console.error("Failed to start transaction monitor:", error);
    process.exit(1);
  }
}

async function startServer() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(transactionRoutes);

  try {
    await fastify.listen({ port: 3000 });
    initializeMonitor();
    console.log("Server is running on http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

startServer();

process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing HTTP server");
  await appContext.service.trxMonitor.stop();
  await prisma.$disconnect();
  process.exit(0);
});
