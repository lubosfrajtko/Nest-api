import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { CryptoswapController } from './cryptoswap.controller';
import { CryptoswapBinanceService } from './cryptoswap.binance.service';
import { CryptoswapCoinpaymentsService } from './cryptoswap.coinpayments.service';
import { MongooseModule } from '@nestjs/mongoose';

import { Payment, PaymentSchema } from './payment.schema';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature(
      [{ name: Payment.name, schema: PaymentSchema }],
      'mongo_db',
    ),
  ],
  controllers: [CryptoswapController],
  providers: [CryptoswapBinanceService, CryptoswapCoinpaymentsService],
  exports: [], // can be defined which services i have to export
})
export class CryptoswapModule {}
