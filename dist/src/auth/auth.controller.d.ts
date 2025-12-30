import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthController {
    private authService;
    private usersService;
    private jwtService;
    constructor(authService: AuthService, usersService: UsersService, jwtService: JwtService);
    login(req: any): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>;
    register(createUserDto: any): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string | null;
            name: string | null;
            year: string | null;
            role: import(".prisma/client").$Enums.UserRole;
        };
    }>;
    refresh(body: {
        refreshToken: string;
    }): Promise<{
        accessToken: string;
        user: any;
    }>;
    logout(body?: {
        refreshToken?: string;
    }): Promise<{
        message: string;
    }>;
    getProfile(req: any): Promise<{
        id: string;
        email: string | null;
        name: string | null;
        year: string | null;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
}
