import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from '../auth/guards/superadmin.guard';
import { AuthService } from '../auth/auth.service';
import { UserRole } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard) // All endpoints require authentication
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async create(@Request() req, @Body() createUserDto: CreateUserDto) {
    // Generate temporary password
    const tempPassword = this.authService.generateTempPassword();
    
    // Create user with temp password
    const user = await this.usersService.createUser(
      req.user.id,
      createUserDto,
      tempPassword,
    );

    // Return user data and temp password (one-time display)
    return {
      user,
      temporaryPassword: tempPassword,
      message: 'User created successfully. Share the temporary password securely.',
    };
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(req.user.id, id, updateUserDto);
  }

  @UseGuards(SuperAdminGuard)
  @Patch(':id/role')
  updateRole(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { role: UserRole },
  ) {
    return this.usersService.updateRole(req.user.id, id, body.role);
  }

  @Post(':id/reset-password')
  async resetPassword(@Request() req, @Param('id') id: string) {
    // Generate new temporary password
    const tempPassword = this.authService.generateTempPassword();
    
    // Reset user password
    await this.usersService.resetPassword(req.user.id, id, tempPassword);

    // Return temp password (one-time display)
    return {
      message: 'Password reset successfully',
      temporaryPassword: tempPassword,
    };
  }

  @UseGuards(SuperAdminGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.usersService.deleteUser(req.user.id, id);
  }
}
