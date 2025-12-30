import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { Prisma, UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    if (!email || !pass) {
      return null;
    }

    const user = await this.usersService.findOne(email.toLowerCase().trim());
    if (user && (await bcrypt.compare(pass, user.password || ''))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role as UserRole,
    };

    const refreshPayload = {
      email: user.email,
      sub: user.id,
      role: user.role as UserRole,
      type: 'refresh',
    };

    const accessTokenExpiry =
      this.configService.get<string>('JWT_EXPIRES_IN') ?? '15m';
    const refreshTokenExpiry =
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d';

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: accessTokenExpiry as any,
      }),
      refresh_token: this.jwtService.sign(refreshPayload, {
        expiresIn: refreshTokenExpiry as any,
      }),
      user,
    };
  }

  async register(data: any) {
    // Input validation
    if (!data.email || !data.password || !data.name) {
      throw new BadRequestException('Name, email, and password are required');
    }

    if (data.password.length < 8) {
      throw new BadRequestException(
        'Password must be at least 8 characters long',
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new BadRequestException('Please enter a valid email address');
    }

    const normalizedEmail = data.email.toLowerCase().trim();
    const existingUser = await this.usersService.findOne(normalizedEmail);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 12); // Increased salt rounds
    const user = await this.usersService.create({
      ...data,
      email: normalizedEmail,
      name: data.name.trim(),
      password: hashedPassword,
    });

    const { password, ...result } = user;

    // Return tokens along with user data (same as login)
    const payload = {
      email: result.email,
      sub: result.id,
      role: result.role as UserRole,
    };

    const refreshPayload = {
      email: result.email,
      sub: result.id,
      role: result.role as UserRole,
      type: 'refresh',
    };

    const accessTokenExpiry =
      this.configService.get<string>('JWT_EXPIRES_IN') ?? '15m';
    const refreshTokenExpiry =
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d';

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: accessTokenExpiry as any,
      }),
      refresh_token: this.jwtService.sign(refreshPayload, {
        expiresIn: refreshTokenExpiry as any,
      }),
      user: result,
    };
  }

  async refreshToken(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role as UserRole,
    };

    const accessTokenExpiry =
      this.configService.get<string>('JWT_EXPIRES_IN') ?? '15m';

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: accessTokenExpiry as any,
      }),
      user,
    };
  }

  async validateRefreshToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token);

      // Check if it's a refresh token
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
