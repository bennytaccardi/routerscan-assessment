import Fastify from "fastify";
import routes from "./routes";

async function startServer() {
  const fastify = Fastify({
    logger: true,
  });

  // Register your routes
  await fastify.register(routes);

  try {
    await fastify.listen({ port: 3000 });
    console.log("Server is running on http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

startServer();
