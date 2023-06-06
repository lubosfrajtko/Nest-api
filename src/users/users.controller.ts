import { Controller, Get, Post, Req, Param } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { User } from './user.schema';
import { Public } from '../auth/authPublic.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  /*
  @Get()
  getHello(): string {
    console.log(process.env.DATABASE_USER);
    // return this.appService.getHello();
    return '';
  } */
  //@Public()
  @Get()
  getUsers() {
    return this.usersService.findAll();
  }

  @Get(':id')
  getUser(@Param() params: any): object {
    return this.usersService.findOne(params.id);
  }

  /*
  @Post()
  async createUser(@Req() request: Request): Promise<User> {
    const user = new User();
    Object.assign(user, request.body);
    const create = await this.usersService.create(user);
    return create;
  } */
}
