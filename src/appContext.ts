import TransactionService from "./services/transaction.service";

const initAppContext = () => {
  const trxService = new TransactionService();

  return {
    service: {
      trxService,
    },
  };
};
declare global {
  // eslint-disable-next-line no-var
  var appContextGlobal: ReturnType<typeof initAppContext> | undefined;
}

export const appContext = globalThis.appContextGlobal ?? initAppContext();
globalThis.appContextGlobal = appContext;
