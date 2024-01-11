import { JwtService } from '@nestjs/jwt';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Role, RoleTypes, User } from '@prisma/client';
import { RolesRepo } from 'api/domain/repos/roles.repo';
import { UsersRepo } from 'api/domain/repos/users.repo';
import { ErrorMessage } from 'api/enums/error-message.enum';
import { SecurityService } from 'api/libs/security/security.service';
import { UserIdentifier } from 'api/types/model-identifiers.types';
import { MailerService } from 'api/libs/mailer/mailer.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UsersRepo,
    private readonly rolesRepo: RolesRepo,
    private readonly securityService: SecurityService,
    private readonly mailerService: MailerService,
  ) { }

  async findUserByEmail(email: Pick<User, 'email'>['email']) {
    return await this.usersRepo.findOneByEmail(email);
  }

  async findUserByEmailAndPassword(user: Pick<User, 'email' | 'password'>) {
    const hashedPassword = await this.securityService.hashPassword(
      user.password,
    );

    return this.usersRepo.findOneByEmailAndPassword(user.email, hashedPassword);
  }

  async makeNewUser(
    user: Pick<User, 'email' | 'password' | 'firstName' | 'lastName'>,
  ) {
    const role = await this.rolesRepo.findOneByType(RoleTypes.User);
    if (!role) {
      return;
    }

    const hashedPassword = await this.securityService.hashPassword(
      user.password,
    );

    return await this.usersRepo.createOne({
      roleId: role.id,
      roleType: role.type,
      email: user.email,
      password: hashedPassword,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  }

  async authenticate(user: User & { role: Role }) {
    const tokens = this.securityService.generateTokens(user);
    await this.usersRepo.setRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async signout(userId: UserIdentifier) {
    return await this.usersRepo.deleteRefreshToken(userId);
  }

  async sendPasswordResetCode(email: string) {
    const user = await this.usersRepo.findOneByEmail(email);

    const { resetToken, randomResetCode } = this.securityService.generateResetToken();

    if (!user) {
      throw new Error(ErrorMessage.UserNotExists);
    }

    if (!user.refreshToken) {
      await this.usersRepo.setRefreshToken(user.id, resetToken);
    }

    return await this.mailerService.sendEmail(user.email, randomResetCode);

  }

  async verifyResetCode(resestData: Pick<User, 'email'> & { code: number }) {
    const user = await this.usersRepo.findOneByEmail(resestData.email);
    const decodedToken = await this.securityService.decodeToken({ refreshToken: user.refreshToken });

    if (decodedToken.code === resestData.code) {
      return true;
    }
    return false;
  }

  async resetPassword(data: Pick<User, 'email' | 'password'>) {
    const hashedPassword = await this.securityService.hashPassword(data.password);
    const resetData: Pick<User, 'email' | 'password'> = {
      email: data.email,
      password: hashedPassword,
    }
    return await this.usersRepo.resetPassword(resetData);
  }

}
