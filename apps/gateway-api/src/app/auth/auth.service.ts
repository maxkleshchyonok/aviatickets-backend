import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { Role, RoleTypes, User } from '@prisma/client';
import { RolesRepo } from 'api/domain/repos/roles.repo';
import { UsersRepo } from 'api/domain/repos/users.repo';
import { ErrorMessage } from 'api/enums/error-message.enum';
import { SecurityService } from 'api/libs/security/security.service';
import { UserIdentifier } from 'api/types/model-identifiers.types';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UsersRepo,
    private readonly rolesRepo: RolesRepo,
    private readonly securityService: SecurityService,
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

  async sendPasswordResetEmail(email: string) {
    const user = await this.usersRepo.findOneByEmail(email);

    if (!user) {
      throw new Error(ErrorMessage.UserNotExists);
    }

    const { resetToken, randomResetCode } = this.securityService.generateResetToken();

    await this.sendEmail(user.email, randomResetCode);

    return resetToken;
  }

  private async sendEmail(email: string, resetCode: number) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      secure: false,
      auth: {
        user: 'aviafinders@gmail.com',
        pass: 'epun tshr rrpd zrhy',
      },
    });

    const mailOptions = {
      from: 'aviafinders@gmail.com',
      to: email,
      subject: 'Password Reset',
      text: `Your verification code: ${resetCode}`,
    };

    await transporter.sendMail(mailOptions);
  }
}
