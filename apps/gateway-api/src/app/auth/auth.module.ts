import { Module } from '@nestjs/common';
import { RolesRepo } from 'api/domain/repos/roles.repo';
import { UsersRepo } from 'api/domain/repos/users.repo';
import { PrismaModule } from 'api/libs/prisma/prisma.module';
import { SecurityModule } from 'api/libs/security/security.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [SecurityModule, PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, UsersRepo, RolesRepo],
})
export class AuthModule {}
