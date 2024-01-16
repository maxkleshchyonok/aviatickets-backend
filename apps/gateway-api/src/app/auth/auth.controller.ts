import {
  Body,
  Controller,
  Get,
  Headers,
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
import { AuthService } from 'api/app/auth/auth.service';
import { SignInForm } from 'api/app/auth/dto/signin.form';
import { SignUpForm } from 'api/app/auth/dto/signup.form';
import { ForgotForm } from 'api/app/auth/dto/forgot.form';
import { VerifyForm } from 'api/app/auth/dto/verify.form';
import { ResetForm } from 'api/app/auth/dto/reset.form';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

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

    const accessToken = await this.authService.authenticate(newUserEntity, body.deviceId);

    return AuthDto.from({
      accessToken,
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

    const accessToken = await this.authService.authenticate(userEntity, body.deviceId);

    return AuthDto.from({
      accessToken,
    });
  }

  @Get('signout')
  @UseGuards(JwtPermissionsGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async signout(@CurrentUser() user: UserSessionDto) {
    await this.authService.signout(user);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotForm) {
    return await this.authService.forgotPassword(body);
  }

  @Post('verify')
  async verifyResetCode(@Headers('authorization') token: string, @Body() body: VerifyForm) {
    return await this.authService.verifyResetCode(body.code, token);
  }

  @Post('reset-password')
  async resetPassword( @Headers('authorization') token: string, @Body() body: ResetForm) {
    return await this.authService.resetPassword(body, token);
  }

}