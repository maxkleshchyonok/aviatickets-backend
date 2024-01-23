import { JwtService } from '@nestjs/jwt';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Device, Role, RoleTypes, User } from '@prisma/client';
import { RolesRepo } from 'libs/domain/src/repos/roles.repo';
import { UsersRepo } from 'libs/domain/src/repos/users.repo';
import { ErrorMessage } from 'api/enums/error-message.enum';
import { SecurityService } from 'libs/security/security.service';
import { UserIdentifier } from 'api/types/model-identifiers.types';
import { MailerService } from 'api/libs/mailer/mailer.service';
import { UserDeviceRepo } from 'libs/domain/src/repos/user-device.repo';
import { UserSessionDto } from 'api/domain/dto/user-session.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UsersRepo,
    private readonly rolesRepo: RolesRepo,
    private readonly devicesRepo: UserDeviceRepo,
    private readonly securityService: SecurityService,
    private readonly mailerService: MailerService,
  ) {}

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

  async authenticate(
    user: User & { role: Role },
    deviceId: Pick<Device, 'deviceId'>['deviceId'],
  ) {
    const accessToken = this.securityService.generateAccessToken(
      user,
      deviceId,
    );

    const data: Pick<User, 'email'> & Pick<Device, 'deviceId'> = {
      email: user.email,
      deviceId: deviceId,
    };

    await this.createDevice(data, null);

    return accessToken;
  }

  async signout(user: UserSessionDto) {
    return await this.devicesRepo.deleteDevice(user.id, user.deviceId);
  }

  async forgotPassword(data: Pick<User, 'email'> & Pick<Device, 'deviceId'>) {
    const user = await this.usersRepo.findOneByEmail(data.email);

    const resetToken = this.securityService.generateResetToken(
      user.id,
      data.deviceId,
    );

    const { hashedCode, randomResetCode } =
      this.securityService.generateRandomCode();

    await this.createDevice(data, hashedCode);

    await this.mailerService.sendEmail(data.email, randomResetCode);

    console.log(resetToken);

    return resetToken;
  }

  async createDevice(
    data: Pick<User, 'email'> & Pick<Device, 'deviceId'>,
    resetCode: Pick<Device, 'hashedResetCode'>['hashedResetCode'],
  ) {
    const user = await this.usersRepo.findOneByEmail(data.email);

    if (!user) {
      throw new Error(ErrorMessage.UserNotExists);
    }

    const deviceData: Pick<Device, 'deviceId' | 'hashedResetCode' | 'userId'> =
      {
        deviceId: data.deviceId,
        hashedResetCode: resetCode,
        userId: user.id,
      };

    return await this.devicesRepo.createDevice(deviceData);
  }

  async verifyResetCode(code: number, resetToken: string) {
    console.log(code, resetToken);

    const { decodedToken } = this.securityService.decodeResetToken(
      resetToken.split(' ')[1],
    );

    const user = await this.usersRepo.findOneById(decodedToken.userId);

    const device = await this.devicesRepo.findOneByUserIdAndDeviceId(
      user,
      decodedToken.deviceId,
    );

    const hashedResetCode = this.securityService.hashResetCode(code);

    if (device.hashedResetCode === hashedResetCode) {
      const resetToken = this.securityService.generateResetToken(
        user.id,
        device.deviceId,
        hashedResetCode,
      );
      return resetToken;
    }

    return null;
  }

  async resetPassword(password: Pick<User, 'password'>, resetToken: string) {
    const { decodedToken, isValid } = this.securityService.decodeResetToken(
      resetToken.split(' ')[1],
    );

    const user = await this.usersRepo.findOneById(decodedToken.userId);

    const deviceData = user.devices.find(
      (device) => device.deviceId === decodedToken.deviceId,
    );

    if (decodedToken.hashedResetCode !== deviceData.hashedResetCode) {
      throw new Error(ErrorMessage.BadVerification);
    }

    if (!deviceData) {
      throw new Error(ErrorMessage.NotAuthorizedDevice);
    }

    if (!isValid) {
      throw new Error(ErrorMessage.BadResetToken);
    }

    const hashedPassword = await this.securityService.hashPassword(
      password.password,
    );

    const resetData: Pick<User, 'email' | 'password'> = {
      email: user.email,
      password: hashedPassword,
    };

    await this.devicesRepo.deleteDevice(user.id, deviceData.deviceId);

    return await this.usersRepo.resetPassword(resetData);
  }

  async changePassword(
    userData: UserSessionDto,
    changeData: {
      oldPassword: string;
      newPassword: string;
      confirmNewPassword: string;
    },
  ) {
    const user = await this.usersRepo.findOneById(userData.id);
    if (user.password === changeData.oldPassword) {
      const newData: Pick<User, 'id' | 'password'> = {
        id: user.id,
        password: changeData.newPassword,
      };
      return this.usersRepo.changePassword(newData);
    }
    return null;
  }
}
