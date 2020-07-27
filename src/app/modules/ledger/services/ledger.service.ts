import { Injectable } from '@angular/core';

import TransportU2F from "@ledgerhq/hw-transport-u2f";
import AppEth from "@ledgerhq/hw-app-eth";
const Web3 = require('web3');
import createLedgerSubprovider from "@ledgerhq/web3-subprovider";
import * as Web3ProviderEngine from "web3-provider-engine";
import * as RpcSubprovider from "web3-provider-engine/subproviders/rpc";

import { Config } from '@shared/services/config';
import { EthTransaction } from '@shared/models/api/eth-transaction';
import { TokenABI, SaleABI, PresaleABI } from './token-abi';
import { WalletTransaction } from '@shared/models/api/wallet-transaction';

@Injectable()
export class LedgerService {

  web3;

  constructor() { }

  initEngine() {
    const engine = new Web3ProviderEngine();
    const getTransport = () => TransportU2F.create();
    const ledger = createLedgerSubprovider(getTransport, {
      accountsLength: 1,
      networkId: 3
    });
    engine.addProvider(ledger);
    engine.addProvider(new RpcSubprovider({rpcUrl: Config.ETHEREUM_PROVIDER }));
    engine.start();
    this.web3 = new Web3(engine);
  }

  public async getAddress(): Promise<string> {
    this.initEngine();
    var address = await new Promise((resolve, reject) => {
      this.web3.eth.getAccounts((err, accs) => {
        if (err != null) {
          reject('There was an error fetching your accounts. ' + err);
        }
        if (accs) {
          if (accs.length === 0) {
            reject(
              'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'
            );
          } else {
            resolve(accs[0]);
          }
        } else {
          reject('Couldn\'t get any accounts! Make sure your Ledger wallet is plugged in properly.');
        }
      })
    }) as string;
    return address;
  }

  public async signEthTx(trxData: EthTransaction): Promise<string> {
    this.initEngine();
    var res = await new Promise((resolve, reject) => {
      trxData.gasPrice = this.web3.toWei(trxData.gasPrice, 'gwei');
      trxData.value = this.web3.toWei(trxData.value, 'ether');
      this.web3.eth.sendTransaction(trxData, (err, result) => {
        if (err != null) {
          reject('There was an error fetching your accounts. ' + err);
        }
        if (result)
          resolve(result);
        else {
          reject('Transaction request failed');
        }
      })
    }) as string;
    return res;
  }

  public async signTokenTx(walletData: WalletTransaction, tokenAddr: string, token_decimal: number): Promise<string> {
    this.initEngine();
    const tokenContract = new this.web3.eth.contract(TokenABI).at(tokenAddr);
    var txnData = tokenContract.transfer.getData(walletData.to_address, (walletData.value * Math.pow(10, token_decimal)));
    var res = await new Promise((resolve, reject) => {
      var trxData: EthTransaction = {
        data: txnData,
        from: walletData.from_address,
        to: tokenAddr,
        gasLimit: walletData.gas_limit,
        gasPrice: this.web3.toWei(walletData.gas_price, 'gwei'),
        value: this.web3.toWei(0, 'wei'),
        nonce: walletData.nonce
      };
      this.web3.eth.sendTransaction(trxData, (err, result) => {
        if (err != null) {
          reject('There was an error fetching your accounts. ' + err);
        }
        if (result)
          resolve(result);
        else {
          reject('Transaction request failed');
        }
      })
    }) as string;
    return res;
  }

  public async signFinalizeSaleTx(walletData: WalletTransaction, walletAddr: string, saleAddr: string, saleType: string): Promise<string> {
    this.initEngine();
    var res = await new Promise((resolve, reject) => {
      if (saleType == 'constant') {
        const saleContract = new this.web3.eth.contract(SaleABI).at(saleAddr);
        var txnData = saleContract.finalizeSale.getData();
      } else if (saleType == 'tiered') {
        const saleContract = new this.web3.eth.contract(PresaleABI).at(saleAddr);
        var txnData = saleContract.finalizePresale.getData();
      } else {
        reject('Sale type not supported');
      }
      var trxData: EthTransaction = {
        data: txnData,
        from: walletAddr,
        to: saleAddr,
        gasLimit: walletData.gas_limit,
        gasPrice: this.web3.toWei(walletData.gas_price, 'gwei'),
        value: this.web3.toWei(0, 'wei'),
        nonce: walletData.nonce
      };
      this.web3.eth.sendTransaction(trxData, (err, result) => {
        if (err != null) {
          reject('There was an error fetching your accounts. ' + err);
        }
        if (result)
          resolve(result);
        else {
          reject('Transaction request failed');
        }
      })
    }) as string;
    return res;
  }

}
