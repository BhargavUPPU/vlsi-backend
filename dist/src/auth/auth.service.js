"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcryptjs");
let AuthService = class AuthService {
    usersService;
    jwtService;
    configService;
    constructor(usersService, jwtService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async validateUser(email, pass) {
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
    async login(user) {
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role,
        };
        const refreshPayload = {
            email: user.email,
            sub: user.id,
            role: user.role,
            type: 'refresh',
        };
        const accessTokenExpiry = this.configService.get('JWT_EXPIRES_IN') ?? '15m';
        const refreshTokenExpiry = this.configService.get('JWT_REFRESH_EXPIRES_IN') ?? '7d';
        return {
            access_token: this.jwtService.sign(payload, {
                expiresIn: accessTokenExpiry,
            }),
            refresh_token: this.jwtService.sign(refreshPayload, {
                expiresIn: refreshTokenExpiry,
            }),
            user,
        };
    }
    async register(data) {
        if (!data.email || !data.password || !data.name) {
            throw new common_1.BadRequestException('Name, email, and password are required');
        }
        if (data.password.length < 8) {
            throw new common_1.BadRequestException('Password must be at least 8 characters long');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            throw new common_1.BadRequestException('Please enter a valid email address');
        }
        const normalizedEmail = data.email.toLowerCase().trim();
        const existingUser = await this.usersService.findOne(normalizedEmail);
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const hashedPassword = await bcrypt.hash(data.password, 12);
        const user = await this.usersService.create({
            ...data,
            email: normalizedEmail,
            name: data.name.trim(),
            password: hashedPassword,
        });
        const { password, ...result } = user;
        const payload = {
            email: result.email,
            sub: result.id,
            role: result.role,
        };
        const refreshPayload = {
            email: result.email,
            sub: result.id,
            role: result.role,
            type: 'refresh',
        };
        const accessTokenExpiry = this.configService.get('JWT_EXPIRES_IN') ?? '15m';
        const refreshTokenExpiry = this.configService.get('JWT_REFRESH_EXPIRES_IN') ?? '7d';
        return {
            access_token: this.jwtService.sign(payload, {
                expiresIn: accessTokenExpiry,
            }),
            refresh_token: this.jwtService.sign(refreshPayload, {
                expiresIn: refreshTokenExpiry,
            }),
            user: result,
        };
    }
    async refreshToken(user) {
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role,
        };
        const accessTokenExpiry = this.configService.get('JWT_EXPIRES_IN') ?? '15m';
        return {
            access_token: this.jwtService.sign(payload, {
                expiresIn: accessTokenExpiry,
            }),
            user,
        };
    }
    async validateRefreshToken(token) {
        try {
            const payload = this.jwtService.verify(token);
            if (payload.type !== 'refresh') {
                throw new common_1.UnauthorizedException('Invalid token type');
            }
            return payload;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map