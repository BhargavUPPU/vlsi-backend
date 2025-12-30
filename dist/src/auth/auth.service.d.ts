import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private usersService;
    private jwtService;
    private configService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        refresh_token: string;
        user: any;
    }>;
    register(data: any): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: string;
            email: string | null;
            name: string | null;
            year: string | null;
            role: import(".prisma/client").$Enums.UserRole;
        };
    }>;
    refreshToken(user: any): Promise<{
        access_token: string;
        user: any;
    }>;
    validateRefreshToken(token: string): Promise<any>;
}
