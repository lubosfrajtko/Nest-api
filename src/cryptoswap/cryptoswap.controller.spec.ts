import { Test, TestingModule } from '@nestjs/testing';
import { CryptoswapController } from './cryptoswap.controller';
import { CryptoswapService } from './cryptoswap.service';

describe('AppController', () => {
  let appController: CryptoswapController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CryptoswapController],
      providers: [CryptoswapService],
    }).compile();

    appController = app.get<CryptoswapController>(CryptoswapController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      // expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
