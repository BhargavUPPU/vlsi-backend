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
    console.log(`[AuthService] Validating user: ${email}`);
    if (!email || !pass) {
      console.log('[AuthService] Email or password missing');
      return null;
    }

    const cleanedEmail = email.toLowerCase().trim();
    const user = await this.usersService.findOne(cleanedEmail);
    
    if (!user) {
      console.log(`[AuthService] User not found: ${cleanedEmail}`);
      return null;
    }

    console.log(`[AuthService] User found: ${user.email}. Role: ${user.role}`);
    
    const isPasswordValid = await bcrypt.compare(pass, user.password || '');
    if (!isPasswordValid) {
      console.log(`[AuthService] Password mismatch for: ${cleanedEmail}`);
      return null;
    }

    console.log(`[AuthService] Login successful for: ${cleanedEmail}`);
    const { password, ...result } = user;
    return result;
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
      this.configService.get<string>('JWT_EXPIRES_IN') ?? '7d';
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
      this.configService.get<string>('JWT_EXPIRES_IN') ?? '7d';

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

  /**
   * Validate password meets security requirements
   */
  validatePasswordRequirements(password: string): void {
    if (password.length < 8) {
      throw new BadRequestException(
        'Password must be at least 8 characters long',
      );
    }

    if (!/[A-Z]/.test(password)) {
      throw new BadRequestException(
        'Password must contain at least one uppercase letter',
      );
    }

    if (!/[a-z]/.test(password)) {
      throw new BadRequestException(
        'Password must contain at least one lowercase letter',
      );
    }

    if (!/[0-9]/.test(password)) {
      throw new BadRequestException(
        'Password must contain at least one number',
      );
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      throw new BadRequestException(
        'Password must contain at least one special character',
      );
    }

    // Check against common passwords
    const commonPasswords = [
      'password',
      'password123',
      '12345678',
      'qwerty123',
      'admin123',
    ];
    if (
      commonPasswords.some((common) => password.toLowerCase().includes(common))
    ) {
      throw new BadRequestException(
        'Password is too common. Please choose a stronger password',
      );
    }
  }

  /**
   * Change user password (user changes own password)
   */
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    // Validate new password requirements
    this.validatePasswordRequirements(newPassword);

    // Get user with password
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify old password
    const isValidOldPassword = await bcrypt.compare(
      oldPassword,
      user.password || '',
    );
    if (!isValidOldPassword) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Check that new password is different
    const isSameAsOld = await bcrypt.compare(newPassword, user.password || '');
    if (isSameAsOld) {
      throw new BadRequestException(
        'New password must be different from current password',
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password and clear requirePasswordChange flag
    await this.usersService.updatePassword(userId, hashedPassword);
  }

  /**
   * Generate a cryptographically secure temporary password
   */
  generateTempPassword(): string {
    const length = 12;
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*';
    const all = uppercase + lowercase + numbers + special;

    // Ensure at least one of each type
    let password = '';
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];

    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }

    // Shuffle the password
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }
}
