import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import { SecurityConfig } from 'api/config/security.config';
import { UserSessionDto } from 'api/domain/dto/user-session.dto';
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
    //const securityConfig = this.config.get<SecurityConfig>('security');
    //const { secret: resetSecret, expiresIn } = securityConfig.resetTokenOptions;

    // const resetToken = jwt.sign({}, resetSecret, {
    //   expiresIn,
    // });
    const randomResetCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

    const payload = {
      code: randomResetCode,
    }

    const secret = 'secret';

    const resetToken = this.jwtService.sign(payload, { secret: secret, expiresIn: '5m' });

    return { resetToken, randomResetCode };
  }

}
