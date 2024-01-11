import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import { SecurityConfig } from 'api/config/security.config';
import { UserSessionDto } from 'api/domain/dto/user-session.dto';
import { ErrorMessage } from 'api/enums/error-message.enum';
import * as crypto from 'crypto';

@Injectable()
export class SecurityService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) { }

  async hashPassword(password: string) {
    const hash = crypto.createHash('MD5');
    return hash.update(password).digest('hex');
  }

  async comparePasswords(plainPassword: string, hashedPassword: string) {
    return (await this.hashPassword(plainPassword)) === hashedPassword;
  }

  generateTokens(model: User & { role: Role }) {
    const payload = UserSessionDto.toPlainObject(model);
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

  generateResetToken() {
    const securityConfig = this.config.get<SecurityConfig>('security');
    const { secret: resetSecret, signOptions: resetSignOptions } =
      securityConfig.resetTokenOptions;

    const min = 100000;
    const max = 999999;
    const randomResetCode = Math.floor(Math.random() * (max - min + 1)) + min;

    const payload = {
      code: randomResetCode,
    }

    const resetToken = this.jwtService.sign(payload, {
      secret: resetSecret,
      ...resetSignOptions,
    });

    return { resetToken, randomResetCode };
  }

  decodeToken(token: Pick<User, 'refreshToken'>) {
    const securityConfig = this.config.get<SecurityConfig>('security');
    const { secret: resetSecret } = securityConfig.resetTokenOptions;

    try {
      const decoded = this.jwtService.verify(token.refreshToken, {
        secret: resetSecret,
      });

      return decoded;
    } catch (error) {
      throw new UnauthorizedException(ErrorMessage.BadResetToken);
    }
  }

}
