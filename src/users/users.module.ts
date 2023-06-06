import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { User } from './user.entity';
import { User, UserSchema } from './user.schema';

@Module({
  imports: [
    // TypeOrmModule.forFeature([UserM], 'mysql_db'),
    //TypeOrmModule.forFeature([User], 'mongo_db'),
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      'mongo_db',
    ),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
