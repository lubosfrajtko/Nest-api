import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { CryptoswapController } from './cryptoswap.controller';
import { CryptoswapBinanceService } from './cryptoswap.binance.service';
import { CryptoswapCoinpaymentsService } from './cryptoswap.coinpayments.service';
import { MongooseModule } from '@nestjs/mongoose';

import { Conversion, ConversionSchema } from './conversion.schema';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature(
      [{ name: Conversion.name, schema: ConversionSchema }],
      'mongo_db',
    ),
  ],
  controllers: [CryptoswapController],
  providers: [CryptoswapBinanceService, CryptoswapCoinpaymentsService],
  exports: [], // can be defined which services i have to export
})
export class CryptoswapModule {}
