export class EthTransaction {
  from: string;
  to: string;
  gasLimit: number;
  gasPrice: number;
  value: number;
  nonce: number;
  data: string;
  timestamp?: number;
}