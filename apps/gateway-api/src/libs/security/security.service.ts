import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class SecurityService {
  async hashPassword(password: string) {
    const hash = crypto.createHash('MD5');
    return hash.update(password).digest('hex');
  }

  async comparePasswords(plainPassword: string, hashedPassword: string) {
    return (await this.hashPassword(plainPassword)) === hashedPassword;
  }
}
