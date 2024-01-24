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
import { UserPermissions } from '@prisma/client';
import { UserSessionDto } from 'api/domain/dto/user-session.dto';
import { UserDto } from 'api/domain/dto/user.dto';
import { UsersDto } from 'api/domain/dto/users.dto';
import { ErrorMessage } from 'api/enums/error-message.enum';
import { CurrentUser } from 'libs/security/decorators/current-user.decorator';
import { RequirePermissions } from 'libs/security/decorators/require-permissions.decorator';
import { JwtPermissionsGuard } from 'libs/security/guards/jwt-permissions.guard';
import { GetAllUserBookingsQueryDto } from './domain/get-all-user-bookings.dto';
import { GetUsersQueryDto } from './domain/get-users-query.dto';
import { UpdateUserForm } from './domain/update-user.form';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermissions(UserPermissions.GetAllUsers)
  @UseGuards(JwtPermissionsGuard)
  async getAllUsers(@Query() query: GetUsersQueryDto) {
    const usersWithCount = await this.usersService.findAllUsers(query);
    return UsersDto.fromResponse(usersWithCount);
  }

  @Get('me/bookings')
  @RequirePermissions(UserPermissions.GetAllUserBookings)
  @UseGuards(JwtPermissionsGuard)
  async getAllUserBookings(
    @CurrentUser() user: UserSessionDto,
    @Query() query: GetAllUserBookingsQueryDto,
  ) {
    const userEntity = await this.usersService.findUserById(user);
    if (!userEntity) {
      throw new InternalServerErrorException(ErrorMessage.RecordNotExists);
    }

    const userBookingsWithCount = await this.usersService.findAllUserBookings(
      user,
      query,
    );

    return UserDto.fromEntity(userEntity, userBookingsWithCount);
  }

  @Get('me')
  @RequirePermissions(UserPermissions.GetUser)
  @UseGuards(JwtPermissionsGuard)
  async getUser(@CurrentUser() user: UserSessionDto) {
    const userEntity = await this.usersService.findUserById(user);
    if (!userEntity) {
      throw new InternalServerErrorException(ErrorMessage.RecordNotExists);
    }

    return UserDto.fromEntity(userEntity);
  }

  @Put(':userId')
  @RequirePermissions(UserPermissions.UpdateUser)
  @UseGuards(JwtPermissionsGuard)
  async updateUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() form: UpdateUserForm,
  ) {
    const user = { id: userId };
    const userEntity = await this.usersService.findUserById(user);
    if (!userEntity) {
      throw new InternalServerErrorException(ErrorMessage.RecordNotExists);
    }

    const updatedUserEntity = await this.usersService.updateUser(user, form);
    if (!updatedUserEntity) {
      throw new InternalServerErrorException(ErrorMessage.RecordUpdationFailed);
    }

    return UserDto.fromEntity(updatedUserEntity);
  }
}
