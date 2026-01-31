import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Matches,
  IsEnum,
} from 'class-validator';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    },
  )
  password: string;

  @IsOptional()
  @IsString({ message: 'Year must be a string' })
  year?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be either USER or ADMIN' })
  role?: UserRole;
}
