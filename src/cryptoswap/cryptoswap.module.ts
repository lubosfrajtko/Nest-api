import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { CryptoswapController } from './cryptoswap.controller';
import { CryptoswapService } from './cryptoswap.service';

@Module({
  imports: [UsersModule],
  controllers: [CryptoswapController],
  providers: [CryptoswapService],
  exports: [], // can be defined which services i have to export
})
export class CryptoswapModule {}
