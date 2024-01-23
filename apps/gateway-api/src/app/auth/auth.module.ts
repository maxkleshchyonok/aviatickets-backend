import { Module } from '@nestjs/common';
import { RolesRepo } from 'libs/domain/src/repos/roles.repo';
import { UsersRepo } from 'libs/domain/src/repos/users.repo';
import { PrismaModule } from 'libs/prisma/prisma.module';
import { SecurityModule } from 'libs/security/security.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailerModule } from 'api/libs/mailer/mailer.module';
import { UserDeviceRepo } from 'libs/domain/src/repos/user-device.repo';

@Module({
  imports: [SecurityModule, PrismaModule, MailerModule],
  controllers: [AuthController],
  providers: [AuthService, UsersRepo, RolesRepo, UserDeviceRepo],
})
export class AuthModule {}
