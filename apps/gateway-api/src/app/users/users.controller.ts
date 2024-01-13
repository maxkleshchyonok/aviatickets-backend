import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { UserSessionDto } from 'api/domain/dto/user-session.dto';
import { UserDto } from 'api/domain/dto/user.dto';
import { UsersDto } from 'api/domain/dto/users.dto';
import { ErrorMessage } from 'api/enums/error-message.enum';
import { CurrentUser } from 'api/libs/security/decorators/current-user.decorator';
import { JwtPermissionsGuard } from 'api/libs/security/guards/jwt-permissions.guard';
import { GetUsersQueryDto } from './domain/get-users-query.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtPermissionsGuard)
  async geAllUsers(@Query() query: GetUsersQueryDto) {
    const usersWithCount = await this.usersService.findAllUsers(query);
    return UsersDto.fromResponse(usersWithCount);
  }

  @Get('me')
  @UseGuards(JwtPermissionsGuard)
  async getUser(@CurrentUser() user: UserSessionDto) {
    const userEntity = await this.usersService.findUserById(user.id);
    if (!userEntity) {
      throw new InternalServerErrorException(ErrorMessage.RecordNotExists);
    }

    return UserDto.fromEntity(userEntity);
  }
}
