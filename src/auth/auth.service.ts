import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail({ email });
    const isMatch = await bcrypt.compare(password, user?.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = {
      email: user.email,
      _id: user._id,
    };
    // save token to user in db
    return {
      access_token: await this.jwtService.signAsync(payload, {
        // secret: `${process.env.JWT_SECRET_KET}`,
      }),
    };
  }

  async register(user: Record<string, string>) {
    return this.usersService.createOne(user);
  }
}
