import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import TransactionService from "../../services/transaction.service";
import { schemas } from "../../schemas/schemas";
import { AddressParams, PaginationParams } from "../../types/requests";

export default async function transactionRoutes(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
) {
  fastify.register(
    async function (fastify, opts) {
      fastify.get<AddressParams>(
        "/trx-address/:address",
        { schema: schemas.getAllTransactionByAddress },
        getAllTransactionByAddress
      );

      fastify.get(
        "/count-trx-address/:address",
        { schema: schemas.getNumberOfTransactionByAddress },
        getNumberOfTransactionByAddress
      );

      fastify.get("/get-all-trx", { schema: schemas.getTrx }, getTrx);
    },
    { prefix: "/transactions" }
  );
}

export async function getAllTransactionByAddress(
  request: FastifyRequest<AddressParams>,
  reply: FastifyReply
) {
  const { address } = request.params;
  const test = new TransactionService();
  const result = await test.getAllTransactionByAddress(address);
  return reply.status(200).send(result);
}

export async function getNumberOfTransactionByAddress(
  request: FastifyRequest<AddressParams>,
  reply: FastifyReply
) {
  const { address } = request.params;
  const test = new TransactionService();
  const result = await test.getNumberOfTransactionByAddress(address);
  return reply.status(200).send(result);
}

export async function getTrx(
  request: FastifyRequest<{
    Querystring: PaginationParams;
  }>,
  reply: FastifyReply
) {
  const page = request.query.page || 1;
  const limit = request.query.limit || 10;
  const test = new TransactionService();
  const result = await test.getAllTrxs(page, limit);
  return reply.status(200).send(result);
}
