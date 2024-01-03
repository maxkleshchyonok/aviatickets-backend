import { Module } from '@nestjs/common';
import { RolesRepo } from '../../domain/repos/roles.repo';
import { UsersRepo } from '../../domain/repos/users.repo';
import { PrismaModule } from '../../libs/prisma/prisma.module';
import { SecurityModule } from '../../libs/security/security.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [SecurityModule, PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, UsersRepo, RolesRepo],
})
export class AuthModule {}
