import {
  Controller,
  Get,
  InternalServerErrorException,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { Put } from '@nestjs/common/decorators/http/request-mapping.decorator';
import {
  Body,
  Param,
} from '@nestjs/common/decorators/http/route-params.decorator';
import { UserSessionDto } from 'api/domain/dto/user-session.dto';
import { UserDto } from 'api/domain/dto/user.dto';
import { UsersDto } from 'api/domain/dto/users.dto';
import { ErrorMessage } from 'api/enums/error-message.enum';
import { CurrentUser } from 'api/libs/security/decorators/current-user.decorator';
import { JwtPermissionsGuard } from 'api/libs/security/guards/jwt-permissions.guard';
import { GetUsersQueryDto } from './domain/get-users-query.dto';
import { UpdateUserForm } from './domain/update-user.form';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtPermissionsGuard)
  async getAllUsers(@Query() query: GetUsersQueryDto) {
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

  @Put(':userId')
  @UseGuards(JwtPermissionsGuard)
  async updateUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() form: UpdateUserForm,
  ) {
    const userEntity = await this.usersService.findUserById(userId);
    if (!userEntity) {
      throw new InternalServerErrorException(ErrorMessage.RecordNotExists);
    }

    const updatedUserEntity = await this.usersService.updateUser(userId, form);
    if (!updatedUserEntity) {
      throw new InternalServerErrorException(ErrorMessage.RecordUpdationFailed);
    }

    return UserDto.fromEntity(updatedUserEntity);
  }
}
