import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import axios from 'axios';
import { Model } from 'mongoose';
import { Payment } from './payment.schema';
import { InjectModel } from '@nestjs/mongoose';
const crypto = require('crypto');

const apiKey =
  'wzBqglTdIf9FSycvn9si6k2U3kCIWgrBlIlnYku407sTvUA9L85oaU6f4EreQbsw';

const secretPublicKey =
  '435a92ec79f9bc364b3f33c2b9c29415779f717f192895842eaee984bf59274a';
const secretPrivateKey =
  '945517811193389dD1e35Aa6F61279B0A3049469E1c1617a8ca17D08597165cb';

const _axios = axios.create({
  baseURL: 'https://www.coinpayments.net/api.php',
  headers: {
    // 'X-MBX-APIKEY': apiKey,
  },
});

@Injectable()
export class CryptoswapCoinpaymentsService {
  constructor(
    private usersService: UsersService,
    @InjectModel(Payment.name, 'mongo_db') private paymentModel: Model<Payment>,
  ) {}

  private async getSignature(_signatureString = '') {
    const signtureString = `version=1&key=${secretPublicKey}${
      _signatureString ? '&' : ''
    }${_signatureString}`;

    const signature = await crypto
      .createHmac('sha512', secretPrivateKey)
      .update(signtureString)
      .digest('hex');

    return signature;
  }

  public async getPayments() {
    const signature = await this.getSignature(`cmd=get_tx_ids`);

    const res = await _axios.post(
      '',
      {
        version: 1,
        key: secretPublicKey,
        cmd: 'get_tx_ids',
      },
      {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          HMAC: signature,
        },
      },
    );

    return res.data;

    //
  }

  public async getExchangeRates() {
    const signature = await this.getSignature(`cmd=rates`);

    const res = await _axios.post(
      '',
      {
        version: 1,
        key: secretPublicKey,
        cmd: 'rates',
      },
      {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          HMAC: signature,
        },
      },
    );

    return res.data;

    //
  }

  public async getConversionLimits(from, to) {
    const signature = await this.getSignature(
      `cmd=convert_limits&from=${from}&to=${to}`,
    );

    const res = await _axios.post(
      '',
      {
        version: 1,
        key: secretPublicKey,
        cmd: 'convert_limits',
        from: from,
        to: to,
      },
      {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          HMAC: signature,
        },
      },
    );

    return res.data;
  }

  public async getConversionInfo(id) {
    const signature = await this.getSignature(
      `cmd=get_conversion_info&id=${id}`,
    );

    const res = await _axios.post(
      '',
      {
        version: 1,
        key: secretPublicKey,
        cmd: 'get_conversion_info',
        id: id,
      },
      {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          HMAC: signature,
        },
      },
    );

    return res.data;
  }

  public getConversions(): string {
    return '';
  }

  public async createConversion(userAddress, coinFrom, coinTo, value) {
    // create conversion in db
    // get conversion info
    // create payment
    // check payment
    // convert crypto and send crypto to user
  }

  public async convertCoins(from, to, amount) {
    const signature = await this.getSignature(
      `cmd=convert&from=${from}&to=${to}&amount=${amount}`,
    );

    const res = await _axios.post(
      '',
      {
        version: 1,
        key: secretPublicKey,
        cmd: 'convert',
        from: from,
        to: to,
        amount: amount,
      },
      {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          HMAC: signature,
        },
      },
    );

    return res.data;
  }

  public async createPayment(currency1, currency2, amount) {
    const signature = await this.getSignature(
      `cmd=create_transaction&currency1=${currency1}&currency2=${currency2}&amount=${amount}&buyer_email=lubos.frajtko%40gmail.com`,
    );

    const res = await _axios.post(
      '',
      {
        version: 1,
        key: secretPublicKey,
        cmd: 'create_transaction',
        currency1: currency1,
        currency2: currency2,
        amount: amount,
        buyer_email: 'lubos.frajtko@gmail.com',
      },
      {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          HMAC: signature,
        },
      },
    );

    return res.data;
  }

  public async confirmPayment() {
    const payment = new Payment();
    Object.assign(payment, { id: new Date(), completed: true });
    const newPayment = new this.paymentModel(payment);
    await newPayment.save();
    return newPayment;
  }
}
