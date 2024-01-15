import { JwtService } from '@nestjs/jwt';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Device, Role, RoleTypes, User } from '@prisma/client';
import { RolesRepo } from 'api/domain/repos/roles.repo';
import { UsersRepo } from 'api/domain/repos/users.repo';
import { ErrorMessage } from 'api/enums/error-message.enum';
import { SecurityService } from 'api/libs/security/security.service';
import { UserIdentifier } from 'api/types/model-identifiers.types';
import { MailerService } from 'api/libs/mailer/mailer.service';
import { UserDeviceRepo } from 'api/domain/repos/user-device.repo';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UsersRepo,
    private readonly rolesRepo: RolesRepo,
    private readonly devicesRepo: UserDeviceRepo,
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
    user: Pick<User, 'email' | 'password' | 'firstName' | 'lastName'>
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

  async authenticate(user: User & { role: Role }, deviceId: Pick<Device, 'deviceId'>['deviceId']) {
    const tokens = this.securityService.generateTokens(user);

    const { resetToken } = this.securityService.generateResetToken();

    const data: Pick<User, 'email'> & Pick<Device, 'deviceId'> = {
      email: user.email,
      deviceId: deviceId,
    }

    await this.createDevice(data, resetToken);

    return tokens;
  }

  async signout(userId: UserIdentifier) {
    //return await this.usersRepo.deleteRefreshToken(userId);
  }

  async sendPasswordResetCode(data: Pick<User, 'email'> & Pick<Device, 'deviceId'>) {

    const { resetToken, randomResetCode } = this.securityService.generateResetToken();

    await this.createDevice(data, resetToken);

    return await this.mailerService.sendEmail(data.email, randomResetCode);
  }

  async createDevice(
    data: Pick<User, 'email'> & Pick<Device, 'deviceId'>,
    resetToken: Pick<Device, "resetToken">['resetToken']
  ) {
    const user = await this.usersRepo.findOneByEmail(data.email);

    if (!user) {
      throw new Error(ErrorMessage.UserNotExists);
    }

    const deviceData: Pick<Device, "deviceId" | "resetToken" | "userId"> = {
      deviceId: data.deviceId,
      resetToken: resetToken,
      userId: user.id,
    }

    return await this.devicesRepo.createDevice(deviceData);
  }

  async verifyResetCode(email: Pick<User, 'email'>['email'], deviceId: Pick<Device, 'deviceId'>, code: number) {
    const user = await this.usersRepo.findOneByEmail(email);
    const tokenData = await this.devicesRepo.findOneByUserIdAndDeviceId(user, deviceId);

    const { decodedToken } = await this.securityService.decodeToken(tokenData.resetToken);

    if (decodedToken.code === code) {
      return true;
    }
    return false;
  }

  async resetPassword(
    email: Pick<User, 'email'>['email'],
    password: Pick<User, 'password'>['password'],
    deviceId: Pick<Device, 'deviceId'>['deviceId']
  ) {
    const user = await this.usersRepo.findOneByEmail(email);

    const deviceData = user.devices.find(device => device.deviceId === deviceId);

    if (!deviceData) {
      throw new Error(ErrorMessage.NotAuthorizedDevice);
    }

    const { isValid } = await this.securityService.decodeToken(deviceData.resetToken);

    if (!isValid) {
      throw new Error(ErrorMessage.BadResetToken);
    }

    const hashedPassword = await this.securityService.hashPassword(password);

    const resetData: Pick<User, 'email' | 'password'> = {
      email: email,
      password: hashedPassword,
    }

    return await this.usersRepo.resetPassword(resetData);
  }

}
