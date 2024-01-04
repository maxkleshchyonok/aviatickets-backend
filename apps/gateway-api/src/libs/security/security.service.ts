import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SecurityConfig } from 'api/config/security.config';
import { UserSessionDto } from 'api/domain/dto/user-session.dto';
import * as crypto from 'crypto';

@Injectable()
export class SecurityService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async hashPassword(password: string) {
    const hash = crypto.createHash('MD5');
    return hash.update(password).digest('hex');
  }

  async comparePasswords(plainPassword: string, hashedPassword: string) {
    return (await this.hashPassword(plainPassword)) === hashedPassword;
  }

  generateTokens(payload: UserSessionDto) {
    const securityConfig = this.config.get<SecurityConfig>('security');

    const { secret: atSecret, signOptions: atSignOptions } =
      securityConfig.accessTokenOptions;
    const { secret: rtSecret, signOptions: rtSignOptions } =
      securityConfig.refreshTokenOptions;

    const accessToken = this.jwtService.sign(payload, {
      secret: atSecret,
      ...atSignOptions,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: rtSecret,
      ...rtSignOptions,
    });

    return { accessToken, refreshToken };
  }
}
