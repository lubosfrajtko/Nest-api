import {
  Controller,
  Get,
  Req,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { CryptoswapBinanceService } from './cryptoswap.binance.service';
import { CryptoswapCoinpaymentsService } from './cryptoswap.coinpayments.service';

@Controller('cryptoswap')
export class CryptoswapController {
  constructor(
    private readonly binanceService: CryptoswapBinanceService,
    private readonly coinpaymentsService: CryptoswapCoinpaymentsService,
  ) {}

  @Get('binance/wallet-balances')
  getBinanceWalletBalances(@Req() req: any) {
    return this.binanceService.getWalletBalances();
  }

  @Get('binance/conversions')
  getBinanceConversions(@Req() req: any) {
    return this.binanceService.getConversions();
  }

  @Post('binance/conversions')
  createBinanceConversion(@Req() req: any, @Body() body: any) {
    if (!body.address || !body.coinFrom || !body.coinTo || !body.value) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
    return this.binanceService.createConversion(
      body.address,
      body.coinFrom,
      body.coinTo,
      body.value,
    );
  }

  // COINPAYMENTS

  @Get('coinpayments/payments')
  getCoinpaymentsPayments() {
    return this.coinpaymentsService.getPayments();
  }

  @Get('coinpayments/exchange-rates')
  getCoinpaymentsExchangeRates() {
    return this.coinpaymentsService.getExchangeRates();
  }

  @Get('coinpayments/conversions/:id')
  getCoinpaymentsConversionInfo(@Req() req: any) {
    if (!req.params.id) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
    return this.coinpaymentsService.getConversionInfo(req.params.id);
  }

  @Get('coinpayments/conversion-limits')
  getCoinpaymentsConversionLimits(@Req() req: any, @Body() body: any) {
    if (!body.from || !body.to) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
    return this.coinpaymentsService.getConversionLimits(body.from, body.to);
  }

  @Post('coinpayments/convert-coins')
  convertCoinpaymentsCoins() {
    return this.coinpaymentsService.convertCoins('ETH', 'SOL', '0.029');
  }

  @Post('coinpayments/create-payment')
  createCoinpaymentsPayment(@Body() body: any) {
    if (!body.currency1 || !body.currency2 || !body.amount) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
    return this.coinpaymentsService.createPayment(
      body.currency1,
      body.currency2,
      body.amount,
    );
  }

  @Post('coinpayments/confirm-payment')
  getCoinpaymentsConfirmPaymeny() {
    return this.coinpaymentsService.confirmPayment();
  }
}
