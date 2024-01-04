import { Injectable } from '@nestjs/common';
import { RoleTypes, User } from '@prisma/client';
import { RolesRepo } from 'api/domain/repos/roles.repo';
import { UsersRepo } from 'api/domain/repos/users.repo';
import { SecurityService } from 'api/libs/security/security.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UsersRepo,
    private readonly rolesRepo: RolesRepo,
    private readonly securityService: SecurityService,
  ) {}

  async findUserByEmail(email: Pick<User, 'email'>['email']) {
    return await this.usersRepo.findOneByEmail(email);
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
}
