export const schemas = {
  getTrx: {
    querystring: {
      type: "object",
      properties: {
        page: { type: "number", minimum: 1, default: 1 },
        limit: { type: "number", minimum: 1, maximum: 1000, default: 10 },
      },
    },
  },
  getNumberOfTransactionByAddress: {
    params: {
      type: "object",
      properties: {
        address: { type: "string", minLength: 1 }, // Require 'address' to be a non-empty string
      },
      required: ["address"],
    },
  },
  getAllTransactionByAddress: {
    params: {
      type: "object",
      properties: {
        address: { type: "string", minLength: 1 },
      },
      required: ["address"],
    },
  },
};
