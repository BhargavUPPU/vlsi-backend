import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.user.create({
      data,
    });
  }

  async findOne(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findAll() {
    // Return all users without passwords
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    return users.map(({ password, ...user }) => user);
  }

  /**
   * Update user password and reset requirePasswordChange flag
   */
  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        requirePasswordChange: false,
        lastPasswordChange: new Date(),
      },
    });
  }

  /**
   * Create user with temporary password (Admin/SuperAdmin only)
   */
  async createUser(adminId: string, userData: {
    email: string;
    name: string;
    role?: UserRole;
    year?: string;
  }, tempPassword: string) {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new BadRequestException('Please enter a valid email address');
    }

    const normalizedEmail = userData.email.toLowerCase().trim();
    const existingUser = await this.findOne(normalizedEmail);

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    const user = await this.prisma.user.create({
      data: {
        email: normalizedEmail,
        name: userData.name.trim(),
        password: hashedPassword,
        role: userData.role || UserRole.USER,
        year: userData.year,
        requirePasswordChange: true,
        createdBy: adminId,
      },
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Reset user password (generatesnew temp password)
   */
  async resetPassword(adminId: string, userId: string, tempPassword: string): Promise<void> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        requirePasswordChange: true,
        lastPasswordChange: new Date(),
      },
    });
  }

  /**
   * Update user role (SuperAdmin only)
   */
  async updateRole(superAdminId: string, userId: string, newRole: UserRole): Promise<any> {
    // Validate requester is super admin
    const requester = await this.findById(superAdminId);
    if (!requester || requester.role !== UserRole.SUPERADMIN) {
      throw new ForbiddenException('Only Super Admin can change user roles');
    }

    const targetUser = await this.findById(userId);
    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    // Prevent changing the last super admin's role
    if (targetUser.role === UserRole.SUPERADMIN) {
      const superAdminCount = await this.prisma.user.count({
        where: { role: UserRole.SUPERADMIN },
      });
      
      if (superAdminCount <= 1) {
        throw new ForbiddenException('Cannot change the role of the last Super Admin');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  /**
   * Update user metadata
   */
  async updateUser(requesterId: string, userId: string, updateData: {
    name?: string;
    year?: string;
    email?: string;
  }): Promise<any> {
    const requester = await this.findById(requesterId);
    if (!requester) {
      throw new ForbiddenException('Unauthorized');
    }

    // Admin can only update their own data or users they created
    // SuperAdmin can update anyone
    const targetUser = await this.findById(userId);
    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    if (requester.role !== UserRole.SUPERADMIN && requesterId !== userId) {
      throw new ForbiddenException('You can only update your own profile');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  /**
   * Delete user (SuperAdmin only)
   */
  async deleteUser(superAdminId: string, userId: string): Promise<void> {
    // Validate requester is super admin
    const requester = await this.findById(superAdminId);
    if (!requester || requester.role !== UserRole.SUPERADMIN) {
      throw new ForbiddenException('Only Super Admin can delete users');
    }

    const targetUser = await this.findById(userId);
    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    // Prevent deleting the last super admin
    if (targetUser.role === UserRole.SUPERADMIN) {
      const superAdminCount = await this.prisma.user.count({
        where: { role: UserRole.SUPERADMIN },
      });
      
      if (superAdminCount <= 1) {
        throw new ForbiddenException('Cannot delete the last Super Admin');
      }
    }

    await this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
