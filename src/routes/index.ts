import { FastifyInstance, FastifyPluginOptions } from "fastify";

export default async function (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
) {
  fastify.get("/", async function (request, reply) {
    fastify.log.info("ok");
    return reply.status(200).send({ success: "Tutto okk" });
  });
}
