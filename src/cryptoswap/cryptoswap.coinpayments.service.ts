import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UsersService } from '../users/users.service';
import axios from 'axios';
import { Model } from 'mongoose';
import { Conversion } from './conversion.schema';
import { InjectModel } from '@nestjs/mongoose';
import { sign } from 'crypto';
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
    @InjectModel(Conversion.name, 'mongo_db')
    private conversionModel: Model<Conversion>,
  ) {}

  private readonly logger = new Logger(CryptoswapCoinpaymentsService.name);

  /**
   * Check conversions
   */
  @Cron('1 * * * * *') // every minute in first second
  async checkConvertions() {
    this.logger.debug('Check conversions');
    // get conversions
    const conversions = await this.conversionModel.find().exec();
    for (let conversion of conversions) {
      if (
        conversion.paymentStatus === 'completed' &&
        (conversion.conversionStatus === 'waiting' ||
          conversion.conversionStatus === 'sent')
      ) {
        const conversionInfo = await this.getConversionInfo(
          conversion.conversion_id,
        );

        // error status codes
        if (
          conversionInfo.status === -1 ||
          conversionInfo.status === -2 ||
          conversionInfo.status === -3
        ) {
          Object.assign(conversion, {
            conversionStatus: 'cancelled',
          });
          await conversion.save();
        }
        // funds sent
        else if (conversionInfo.status === 1) {
          Object.assign(conversion, {
            conversionStatus: 'sent',
          });
          await conversion.save();
        }
        // conversion complete
        else if (conversionInfo.status === 2) {
          Object.assign(conversion, {
            conversionStatus: 'completed',
          });
          await conversion.save();
        }
      }
    }
  }
  //

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

    return res.data.result;
  }

  public getConversions(): string {
    return '';
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
    //if (!res.data.error !== 'ok') return false;

    console.log(res);

    return res.data.result.id;
  }

  public async createPayment(currency1, currency2, amount, address) {
    try {
      // create payment in coinpayments
      const signature = await this.getSignature(
        `cmd=create_transaction&currency1=${currency1}&currency2=${currency2}&amount=${amount}&buyer_email=lubos.frajtko%40gmail.com&ipn_url=http%3A%2F%2F65.109.171.191%3A3003%2Fcryptoswap%2Fcoinpayments%2Fconfirm-payment`,
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
          ipn_url:
            'http://65.109.171.191:3003/cryptoswap/coinpayments/confirm-payment',
        },
        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            HMAC: signature,
          },
        },
      );
      if (res.data.error !== 'ok') throw new Error('Error occured');

      // create conversion
      const conversion = new Conversion();
      Object.assign(conversion, {
        txn_id: res.data.result.txn_id,
        address: address,
        checkoutUrl: res.data.result.checkout_url,
        currencyFrom: currency1,
        currencyTo: currency2,
        currencyFromAmount: amount,
        currencyToAmount: 0,
      });
      const newConversion = new this.conversionModel(conversion);
      await newConversion.save();

      return newConversion;
    } catch (e) {
      console.log(e);
    }
  }

  public async confirmPayment(data) {
    try {
      if (data.status_text === 'Complete') {
        // get conversion
        const conversion = await this.conversionModel.findOne({
          txn_id: data.txn_id,
        });
        console.log(conversion);
        if (!conversion) throw new Error('Error occured');

        // save status completed conversion
        Object.assign(conversion, {
          paymentStatus: 'completed',
        });
        await conversion.save();

        // execute conversion
        const conversionId = await this.convertCoins(
          conversion.currencyFrom,
          conversion.currencyTo,
          conversion.currencyFromAmount,
        );
        console.log(conversionId);

        // save status completed conversion
        Object.assign(conversion, {
          conversion_id: conversionId,
          conversionStatus: 'waiting',
        });
        await conversion.save();

        return true;
      }
    } catch (e) {
      console.log(e);
    }
  }
}
