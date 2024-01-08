import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthDto } from 'api/domain/dto/auth.dto';
import { UserSessionDto } from 'api/domain/dto/user-session.dto';
import { ErrorMessage } from 'api/enums/error-message.enum';
import { CurrentUser } from 'api/libs/security/decorators/current-user.decorator';
import { JwtPermissionsGuard } from 'api/libs/security/guards/jwt-permissions.guard';
import { AuthService } from './auth.service';
import { SignInForm } from './dto/signin.form';
import { SignUpForm } from './dto/signup.form';
import { env } from 'process';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: SignUpForm) {
    const userEntity = await this.authService.findUserByEmail(body.email);
    if (userEntity) {
      throw new InternalServerErrorException(ErrorMessage.UserAlreadyExists);
    }

    const newUserEntity = await this.authService.makeNewUser(body);
    if (!newUserEntity) {
      throw new InternalServerErrorException(ErrorMessage.UserCreationFailed);
    }

    const tokens = await this.authService.authenticate(newUserEntity);

    return AuthDto.from({
      ...tokens,
      user: newUserEntity,
    });
  }

  @Post('signin')
  async signin(@Body() body: SignInForm) {
    const userEntity = await this.authService.findUserByEmailAndPassword({
      email: body.email,
      password: body.password,
    });

    if (!userEntity) {
      throw new InternalServerErrorException(ErrorMessage.UserNotExists);
    }

    const tokens = await this.authService.authenticate(userEntity);

    return AuthDto.from({
      ...tokens,
      user: userEntity,
    });
  }

  @Get('signout')
  @UseGuards(JwtPermissionsGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async signout(@CurrentUser() user: UserSessionDto) {
    await this.authService.signout(user.id);
  }
}