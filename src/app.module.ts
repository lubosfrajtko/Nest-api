import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middleware/logger.middleware';
// modules
import { CryptoswapModule } from './cryptoswap/cryptoswap.module';
import { UsersModule } from './users/users.module';
// config
import { ConfigModule } from '@nestjs/config';
// type orm
import { TypeOrmModule } from '@nestjs/typeorm';
// models
import { User } from './users/user.entity';
// mongoose
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.dev.env'] }),
    // connect to mysql db
    /*TypeOrmModule.forRoot({
      type: 'mysql',
      name: 'mysql_db',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [User],
      synchronize: true, // shouldnt be used in production - can lose production data
    }), */
    // connect to mongo via typeorm
    /*TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb+srv://lubos:Lf7452123456@cluster0.ejmxbox.mongodb.net/?retryWrites=true&w=majority',
      name: 'mongo_db',
      //host: 'cluster0.ejmxbox.mongodb.net',
      // port: 27017,
      //username: 'lubos',
      //password: 'Lf7452123456',
      database: 'hyperledger-fabric',
      entities: [User],
      synchronize: true,
      //driver: { ssl: true, authSource: 'admin' },
    }), */
    // connect to mongodb
    MongooseModule.forRoot(`mongodb://localhost/cryptoswap`, {
      connectionName: 'mongo_db',
    }),
    UsersModule,
    CryptoswapModule,
    AuthModule,
  ],
  //controllers: [AppController],
  //providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(
      { path: 'smarttrust', method: RequestMethod.ALL },
      // { path: 'auth', method: RequestMethod.ALL },
    ); // can be specified also method
  }
}
