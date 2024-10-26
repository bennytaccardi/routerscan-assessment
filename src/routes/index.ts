import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import TransactionService from "../services/transaction.service";

interface AddressParams {
  Params: {
    address: string;
  };
}

export async function getAllTransactionByAddress(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
) {
  fastify.get<AddressParams>(
    "/trx-address/:address",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            address: { type: "string", minLength: 1 },
          },
          required: ["address"],
        },
      },
    },
    async function (request, reply) {
      const { address } = request.params;
      const test = new TransactionService();
      const result = await test.getAllTransactionByAddress(address);
      return reply.status(200).send(result);
    }
  );
}

export async function getNumberOfTransactionByAddress(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
) {
  fastify.get<AddressParams>(
    "/count-trx-address/:address",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            address: { type: "string", minLength: 1 }, // Require 'address' to be a non-empty string
          },
          required: ["address"],
        },
      },
    },
    async function (request, reply) {
      const { address } = request.params;
      const test = new TransactionService();
      const result = await test.getNumberOfTransactionByAddress(address);
      return reply.status(200).send(result);
    }
  );
}

const schema = {
  querystring: {
    type: "object",
    properties: {
      page: { type: "number", minimum: 1, default: 1 },
      limit: { type: "number", minimum: 1, maximum: 1000, default: 10 },
    },
  },
};

interface PaginationParams {
  page?: number;
  limit?: number;
}

export async function getTrx(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
) {
  fastify.get(
    "/get-all-trx",
    { schema },
    async function (
      request: FastifyRequest<{
        Querystring: PaginationParams;
      }>,
      reply
    ) {
      const page = request.query.page || 1;
      const limit = request.query.limit || 10;
      const skip = (page - 1) * limit;
      const take = limit;
      const test = new TransactionService();
      const result = await test.getAllTrxs(page, limit);
      return reply.status(200).send(result);
    }
  );
}
