import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
//import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
//import { Repository, DataSource } from 'typeorm';
//import { User as UserM } from './user.entity';
import { User } from './user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    // mysql
    /*@InjectRepository(UserM, 'mysql_db')
    private usersRepository: Repository<UserM>,
    @InjectDataSource('mysql_db')
    private dataSource: DataSource, */
    // mongodb
    @InjectModel(User.name, 'mongo_db') private userModel: Model<User>,
  ) {}

  /* mysql
  findAll(): Promise<UserM[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<UserM | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async create(user: UserM) {
    const res = await this.dataSource.transaction(async (manager) => {
      return await manager.save(user);
    });
    return res;
  }

  async createMany(users: UserM[]) {
    await this.dataSource.transaction(async (manager) => {
      await manager.save(users[0]);
      await manager.save(users[1]);
    });
  } */

  // mongo
  async createOne(data): Promise<User> {
    try {
      const user = new User();
      data.password = await bcrypt.hashSync(data.password, 10);
      Object.assign(user, data);
      const newUser = new this.userModel(user);
      await newUser.save();
      return newUser;
    } catch (e) {
      throw new HttpException('BadRequest', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id): Promise<User | undefined> {
    const user = await this.userModel.findById(id);
    if (!user) throw new HttpException('NotFound', HttpStatus.NOT_FOUND);
    return user;
  }

  async findByEmail(email): Promise<User | undefined> {
    const user = await this.userModel.findOne(email);
    console.log(user);
    if (!user) throw new HttpException('NotFound', HttpStatus.NOT_FOUND);
    return user;
  }
}
