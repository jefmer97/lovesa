import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(name: string, email: string, pass: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(pass, salt);
    
    const user = await this.usersService.create(name, email, hash);
    
    const payload = { email: user.email, sub: (user as any)._id };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: (user as any)._id, name: user.name, email: user.email }
    };
  }

  async login(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: (user as any)._id };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: (user as any)._id, name: user.name, email: user.email }
    };
  }
}
