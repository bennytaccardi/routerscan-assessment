export interface Transaction {
  timestamp: Date;
  status: boolean;
  block_number: number;
  tx_index: number;
  from: string;
  to: string;
  value: bigint;
  gas_limit: number;
  gas_used: number;
  gas_price: bigint;
}
