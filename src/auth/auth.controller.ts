import { Controller, Request, Post, UseGuards, Body, Get, UnauthorizedException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    try {
      const result = await this.authService.login(req.user);
      // Transform snake_case to camelCase for frontend
      return {
        accessToken: result.access_token,
        refreshToken: result.refresh_token,
        user: {
          ...result.user,
          requirePasswordChange: result.user.requirePasswordChange || false,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Login failed');
    }
  }

  @Post('register')
  async register(@Body() createUserDto: any) {
    // Registration disabled - users must be created by administrators
    throw new ForbiddenException('Public registration is disabled. Please contact an administrator.');
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    try {
      if (!body.refreshToken) {
        throw new UnauthorizedException('Refresh token is required');
      }

      // Validate the refresh token using the service
      const payload = await this.authService.validateRefreshToken(body.refreshToken);
      
      // Get fresh user data
      const user = await this.usersService.findOne(payload.email);
      
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new access token
      const result = await this.authService.refreshToken(user);
      
      return {
        accessToken: result.access_token,
        user: result.user,
      };
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  @Post('logout')
  async logout(@Body() body?: { refreshToken?: string }) {
    // In a production app, you might want to blacklist the token
    // For now, we'll just return success since client will remove tokens
    // TODO: Implement token blacklisting for enhanced security
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    try {
      // Get fresh user data from database
      const user = await this.usersService.findOne(req.user.email);
      
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw new UnauthorizedException('Unable to get profile');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Request() req, @Body() body: { oldPassword: string; newPassword: string }) {
    try {
      if (!body.oldPassword || !body.newPassword) {
        throw new BadRequestException('Old password and new password are required');
      }

      await this.authService.changePassword(req.user.id, body.oldPassword, body.newPassword);
      
      return { message: 'Password changed successfully' };
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw new BadRequestException('Failed to change password');
    }
  }
}
