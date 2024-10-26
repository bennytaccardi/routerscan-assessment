import Fastify from "fastify";
import transactionRoutes from "./routes/transaction";

async function startServer() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(transactionRoutes);

  try {
    await fastify.listen({ port: 3000 });
    console.log("Server is running on http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

startServer();
