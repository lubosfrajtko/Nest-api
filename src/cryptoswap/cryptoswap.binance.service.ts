import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import axios from 'axios';
import fs from 'fs';
const crypto = require('crypto');

const apiKey =
  'N1wz2Uf4opuSqlvK1M1GTac97l6puFB68e7B9W18D711qSJuttx9MX1LzFHyYG5Y';
const secretKey =
  'CZBnnJILtO3hbm51ikWjBjuaNF2B32jJG9aUHP1B6TXeo4pj8754hKAeVdIuN0rs';

const _axios = axios.create({
  baseURL: 'https://api1.binance.com',
  headers: {
    'X-MBX-APIKEY': apiKey,
  },
});

@Injectable()
export class CryptoswapBinanceService {
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

  public async sendConversionRequest(reqString, coinFrom, coinTo) {
    const { signature, timestamp } = await this.getSignature(reqString);

    const res = await _axios.post('/sapi/v1/convert/getQuote', {
      fromAsset: coinFrom,
      toAsset: coinTo,
      signature,
      timestamp,
    });

    return res.data;
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

    // send conversion request
    /*const conversionReq = await this.sendConversionRequest(
      `fromAsset=${coinFrom}&toAsset=${coinTo}`,
      coinFrom,
      coinTo,
    );
    console.log(conversionReq); */

    // /sapi/v1/convert/exchangeInfo

    /*
    const res = await _axios.get('/sapi/v1/convert/exchangeInfo', {
      params: {
        fromAsset: coinFrom,
        toAsset: coinTo,
        signature,
        timestamp,
      },
    });
    console.log(res); */

    try {
      const { signature, timestamp } = await this.getSignature(
        `startTime=1686591932198&endTime=1686591232198`,
      );
      const res = await _axios.get('/sapi/v1/convert/tradeFlow', {
        params: {
          // startTime: 1686586044617,
          // endTime: 1686588244617,
          startTime: 1686591932198,
          endTime: 1686591232198,
          signature,
          timestamp,
        },
      });
      console.log(res);

      /*
      const { signature, timestamp } = await this.getSignature(``);
      const res = await _axios.get('/sapi/v1/bswap/swap', {
        params: {
          //startTime: 1686585744617,
          // endTime: 1686588244617,
          signature,
          timestamp,
        },
      });
      console.log(res); */

      /*
      const res = await _axios.post('/sapi/v1/convert/getQuote', {
        fromAsset: coinFrom,
        toAsset: coinTo,
        signature,
        timestamp,
      });

      console.log(res); */
    } catch (e) {
      console.log(e);
    }
    return coinFromAddress;

    // send crypto to binance wallet
    // check deposit...
    // convert crypto
    // send crypto to user
  }
}
