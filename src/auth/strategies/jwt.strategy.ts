import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-super-secret-jwt-key-change-this-in-production',
      issuer: configService.get<string>('JWT_ISSUER') || 'vlsi-app',
      audience: configService.get<string>('JWT_AUDIENCE') || 'vlsi-users',
    });
  }

  async validate(payload: any) {
    // Validate that this is not a refresh token
    if (payload.type === 'refresh') {
      throw new UnauthorizedException('Cannot use refresh token for authentication');
    }

    // Optionally verify user still exists and is active
    const user = await this.usersService.findOne(payload.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return { 
      id: payload.sub, 
      email: payload.email, 
      role: payload.role,
      iat: payload.iat,
    };
  }
}
