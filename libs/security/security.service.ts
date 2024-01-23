import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Device, Role, User } from '@prisma/client';
import { SecurityConfig } from 'api/config/security.config';
import { UserSessionDto } from 'api/domain/dto/user-session.dto';
import { ErrorMessage } from 'api/enums/error-message.enum';
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

  generateAccessToken(
    model: User & { role: Role },
    deviceId: Pick<Device, 'deviceId'>['deviceId'],
  ) {
    const payload = UserSessionDto.toPlainObject(model, deviceId);
    const securityConfig = this.config.get<SecurityConfig>('security');

    const { secret: atSecret, signOptions: atSignOptions } =
      securityConfig.accessTokenOptions;

    const accessToken = this.jwtService.sign(payload, {
      secret: atSecret,
      ...atSignOptions,
    });

    return accessToken;
  }

  generateResetToken(
    userId: Pick<User, 'id'>['id'],
    deviceId: Pick<Device, 'deviceId'>['deviceId'],
    hashedResetCode: Pick<Device, 'hashedResetCode'>['hashedResetCode'] = null,
  ) {
    const securityConfig = this.config.get<SecurityConfig>('security');
    const { secret: resetSecret, signOptions: resetSignOptions } =
      securityConfig.resetTokenOptions;

    const payload = {
      deviceId,
      userId,
      hashedResetCode,
    };

    const resetToken = this.jwtService.sign(payload, {
      secret: resetSecret,
      ...resetSignOptions,
    });

    return resetToken;
  }

  decodeResetToken(token: string) {
    const securityConfig = this.config.get<SecurityConfig>('security');
    const { secret: resetSecret } = securityConfig.resetTokenOptions;

    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: resetSecret,
      });
      const isValid = true;

      return { decodedToken, isValid };
    } catch (error) {
      throw new UnauthorizedException(ErrorMessage.BadResetToken);
    }
  }

  generateRandomCode() {
    const min = 100000;
    const max = 999999;
    const randomResetCode = Math.floor(Math.random() * (max - min + 1)) + min;
    const hashedCode = this.hashResetCode(randomResetCode);

    return { hashedCode, randomResetCode };
  }

  hashResetCode(resetCode: number) {
    const hash = crypto.createHash('sha256');
    hash.update(resetCode.toString());
    const hashedCode = hash.digest('hex');
    return hashedCode;
  }
}
