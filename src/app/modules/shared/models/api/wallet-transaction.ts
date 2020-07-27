import { EthTransaction } from "./eth-transaction";

export class WalletTransaction {
  from_address: string;
  to_address: string;
  tx_hash: string;
  gas_limit: number;
  gas_price: number;
  currency: string;
  value: number;
  nonce: number;
  data: string;
  status: string;
  timestamp?: number;
  toEthTransaction(): EthTransaction {
    const trx = new EthTransaction();
    trx.data = this.data;
    trx.from = this.from_address;
    trx.gasLimit = this.gas_limit;
    trx.gasPrice = this.gas_price;
    trx.nonce = this.nonce;
    trx.to = this.to_address;
    trx.value = this.value;
    return trx;
  }
}