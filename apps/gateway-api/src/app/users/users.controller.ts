import { Controller, Get, Query } from '@nestjs/common';
import { UsersDto } from 'api/domain/dto/users.dto';
import { GetUsersQueryDto } from './domain/get-users-query.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async geAllUsers(@Query() query: GetUsersQueryDto) {
    const usersWithCount = await this.usersService.findAllUsers(query);
    return UsersDto.fromResponse(usersWithCount);
  }
}
