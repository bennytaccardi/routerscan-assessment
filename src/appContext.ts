import TransactionMonitor from "./services/transaction-monitor.service";
import TransactionService from "./services/transaction.service";

export interface IAppContext {
  service: {
    trxService: TransactionService;
    trxMonitor: TransactionMonitor;
  };
}

const initAppContext = (): IAppContext => {
  const trxService = new TransactionService();
  const trxMonitor = new TransactionMonitor();

  return {
    service: {
      trxService,
      trxMonitor,
    },
  };
};
declare global {
  // eslint-disable-next-line no-var
  var appContextGlobal: ReturnType<typeof initAppContext> | undefined;
}

export const appContext = globalThis.appContextGlobal ?? initAppContext();
globalThis.appContextGlobal = appContext;
