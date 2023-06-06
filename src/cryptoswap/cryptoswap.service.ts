import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import axios from 'axios';
import fs from 'fs';
const crypto = require('crypto');

const apiKey =
  'wzBqglTdIf9FSycvn9si6k2U3kCIWgrBlIlnYku407sTvUA9L85oaU6f4EreQbsw';
const secretKey =
  'IGv9ywym63SmdbUpM03vbCzXktfV59WjFYpSfsdE1cjWITOYMXCJqlAjN7HOkvWS';

const _axios = axios.create({
  baseURL: 'https://api1.binance.com',
  headers: {
    'X-MBX-APIKEY': apiKey,
  },
});

@Injectable()
export class CryptoswapService {
  constructor(private usersService: UsersService) {}

  private async getSignature(_signature = '') {
    const timestamp = new Date().getTime();
    const timestampString =
      _signature + `${_signature ? '&' : ''}timestamp=` + timestamp;

    const signature = await crypto
      .createHmac('sha256', secretKey)
      .update(timestampString)
      .digest('hex');

    return { signature, timestamp };
  }

  public async getWalletBalances() {
    const { signature, timestamp } = await this.getSignature();

    const res = await _axios.get('/sapi/v1/capital/config/getall', {
      params: {
        signature,
        timestamp,
      },
    });

    return res.data;
  }

  public async getWalletDepositAddress(coin) {
    const { signature, timestamp } = await this.getSignature(`coin=${coin}`);

    const res = await _axios.get('/sapi/v1/capital/deposit/address', {
      params: {
        coin: coin,
        signature,
        timestamp,
      },
    });

    return res.data;
  }

  public async getCostOfConversion() {
    //
  }

  public getConversions(): string {
    return '';
  }

  public async createConversion(userAddress, coinFrom, coinTo, value) {
    const { signature, timestamp } = await this.getSignature();

    // get coin from deposit address
    const coinFromAddress = await this.getWalletDepositAddress(coinFrom);
    if (!coinFromAddress.address) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    //  fs.writeFileSync('./output.txt', JSON.stringify(addresses));

    return coinFromAddress;

    // send crypto to binance wallet
    // check deposit...
    // convert crypto
    // send crypto to user
  }
}
