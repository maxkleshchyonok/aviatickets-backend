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
    const tokens = this.securityService.generateTokens(user, deviceId);

    const data: Pick<User, 'email'> & Pick<Device, 'deviceId'> = {
      email: user.email,
      deviceId: deviceId,
    }

    await this.createDevice(data, null);

    return tokens;
  }

  async signout(userId: UserIdentifier, deviceId: Pick<Device, 'deviceId'>['deviceId']) {
    return await this.devicesRepo.deleteDevice(userId, deviceId);
  }

  async forgotPassword(data: Pick<User, 'email'> & Pick<Device, 'deviceId'>) {
    const user = await this.usersRepo.findOneByEmail(data.email);

    const resetToken = this.securityService.generateResetToken(user.id, data.deviceId);

    const { hashedCode, randomResetCode } = this.securityService.generateRandomCode();

    await this.createDevice(data, hashedCode);

    await this.mailerService.sendEmail(data.email, randomResetCode);

    return resetToken;
  }

  async createDevice(
    data: Pick<User, 'email'> & Pick<Device, 'deviceId'>,
    resetCode: Pick<Device, 'hashedResetCode'>['hashedResetCode']
  ) {
    const user = await this.usersRepo.findOneByEmail(data.email);

    if (!user) {
      throw new Error(ErrorMessage.UserNotExists);
    }

    const deviceData: Pick<Device, "deviceId" | 'hashedResetCode' | "userId"> = {
      deviceId: data.deviceId,
      hashedResetCode: resetCode,
      userId: user.id,
    }

    return await this.devicesRepo.createDevice(deviceData);
  }

  async verifyResetCode(code: number, resetToken: string) {

    const { decodedToken } = this.securityService.decodeResetToken(resetToken);

    const user = await this.usersRepo.findOneById(decodedToken.userId);

    const device = await this.devicesRepo.findOneByUserIdAndDeviceId(user, decodedToken.deviceId);

    const hashedResetCode = this.securityService.hashResetCode(code);

    if (device.hashedResetCode === hashedResetCode) {
      return true;
    }
    return false;
  }

  async resetPassword(password: Pick<User, 'password'>, resetToken: string) {
    const { decodedToken, isValid } = this.securityService.decodeResetToken(resetToken);

    const user = await this.usersRepo.findOneById(decodedToken.userId);

    const deviceData = user.devices.find(device => device.deviceId === decodedToken.deviceId);

    if (!deviceData) {
      throw new Error(ErrorMessage.NotAuthorizedDevice);
    }

    if (!isValid) {
      throw new Error(ErrorMessage.BadResetToken);
    }

    const hashedPassword = await this.securityService.hashPassword(password.password);

    const resetData: Pick<User, 'email' | 'password'> = {
      email: user.email,
      password: hashedPassword,
    }

    return await this.usersRepo.resetPassword(resetData);
  }

}
