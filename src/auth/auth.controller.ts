import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Get,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  HttpStatus,
  HttpCode,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import {
  RegisterDto,
  LoginDto,
  ChangePasswordDto,
  RefreshTokenDto,
} from './dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async login(@Request() req, @Body() loginDto: LoginDto) {
    try {
      const result = await this.authService.login(req.user);
      // Transform snake_case to camelCase for frontend
      return {
        status: 'success',
        message: 'Login successful',
        data: {
          accessToken: result.access_token,
          refreshToken: result.refresh_token,
          user: {
            ...result.user,
            requirePasswordChange: result.user.requirePasswordChange || false,
          },
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Login failed');
    }
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async register(@Body() registerDto: RegisterDto) {
    try {
      console.log('[AuthController] Registration attempt:', {
        ...registerDto,
        password: '[HIDDEN]'
      });
      
      const result = await this.authService.register(registerDto);

      console.log('[AuthController] Registration successful for:', registerDto.email);
      
      return {
        status: 'success',
        message: 'Registration successful',
        accessToken: result.access_token,
        refreshToken: result.refresh_token,
        user: result.user,
      };
    } catch (error) {
      console.error('[AuthController] Registration failed:', {
        email: registerDto.email,
        error: error.message,
        stack: error.stack
      });
      
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Registration failed. Please try again.');
    }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    try {
      // Validate the refresh token using the service
      const payload = await this.authService.validateRefreshToken(
        refreshTokenDto.refreshToken,
      );

      // Get fresh user data
      const user = await this.usersService.findOne(payload.email);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new access token
      const result = await this.authService.refreshToken(user);

      return {
        status: 'success',
        message: 'Token refreshed successfully',
        data: {
          accessToken: result.access_token,
          user: result.user,
        },
      };
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() body?: { refreshToken?: string }) {
    // In a production app, you might want to blacklist the token
    // For now, we'll just return success since client will remove tokens
    // TODO: Implement token blacklisting for enhanced security
    return {
      status: 'success',
      message: 'Logged out successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Request() req) {
    try {
      // Get fresh user data from database
      const user = await this.usersService.findOne(req.user.email);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const { password, ...userWithoutPassword } = user;
      return {
        status: 'success',
        message: 'Profile retrieved successfully',
        data: {
          user: userWithoutPassword,
        },
      };
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw new UnauthorizedException('Unable to get profile');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    try {
      await this.authService.changePassword(
        req.user.id,
        changePasswordDto.oldPassword,
        changePasswordDto.newPassword,
      );

      return {
        status: 'success',
        message: 'Password changed successfully',
      };
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw new BadRequestException('Failed to change password');
    }
  }
}
