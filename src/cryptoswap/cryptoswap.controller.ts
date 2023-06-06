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
import { CryptoswapService } from './cryptoswap.service';

@Controller('cryptoswap')
export class CryptoswapController {
  constructor(private readonly service: CryptoswapService) {}

  @Get('wallet-balances')
  getWalletBalances(@Req() req: any) {
    return this.service.getWalletBalances();
  }

  @Get('conversions')
  getConversions(@Req() req: any) {
    return this.service.getConversions();
  }

  @Post('conversions')
  createConversion(@Req() req: any, @Body() body: any) {
    if (!body.address || !body.coinFrom || !body.coinTo || !body.value) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
    return this.service.createConversion(
      body.address,
      body.coinFrom,
      body.coinTo,
      body.value,
    );
  }

  /*
  @Get('assets')
  getAssets() {
    return this.stService.getAllAssets();
  }

  @Get('assets/:id')
  getAsset(@Param() params: any) {
    return this.stService.getAsset(params.id);
  }

  @Post('assets')
  createAsset() {
    return this.stService.createAsset();
  } */
}
