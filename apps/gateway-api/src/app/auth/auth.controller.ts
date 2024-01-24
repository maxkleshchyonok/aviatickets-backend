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
import { CurrentUser } from 'libs/security/decorators/current-user.decorator';
import { JwtPermissionsGuard } from 'libs/security/guards/jwt-permissions.guard';
import { AuthService } from 'api/app/auth/auth.service';
import { SignInForm } from 'api/app/auth/dto/signin.form';
import { SignUpForm } from 'api/app/auth/dto/signup.form';
import { ForgotPasswordForm } from 'api/app/auth/dto/forgot-password.form';
import { VerifyResetCodeForm } from 'api/app/auth/dto/verify-reset-code.form';
import { ResetPasswordForm } from 'api/app/auth/dto/reset-password.form';
import { ChangePasswordForm } from './dto/change-password.form';
import { RequirePermissions } from 'libs/security/decorators/require-permissions.decorator';
import { UserPermissions } from '@prisma/client';
import { RefreshTokenGuard } from 'libs/security/guards/refresh-token.guard';
import { ResetTokenGuard } from 'libs/security/guards/reset-token.guard';
import { UserResetTokenDto } from 'api/domain/dto/user-reset-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: SignUpForm) {
    const userEntity = await this.authService.findUserByEmail(body);
    if (userEntity) {
      throw new InternalServerErrorException(ErrorMessage.UserAlreadyExists);
    }

    if (body.password !== body.confirmPassword) {
      throw new InternalServerErrorException(ErrorMessage.BadPassword);
    }

    const newUserEntity = await this.authService.makeNewUser(body);
    if (!newUserEntity) {
      throw new InternalServerErrorException(ErrorMessage.UserCreationFailed);
    }

    const tokens = await this.authService.authenticate(newUserEntity, body);

    return AuthDto.from(tokens);
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

    const tokens = await this.authService.authenticate(userEntity, body);

    return AuthDto.from(tokens);
  }

  @Post('signout')
  @RequirePermissions(UserPermissions.SignOut)
  @UseGuards(JwtPermissionsGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async signout(@CurrentUser() user: UserSessionDto) {
    return await this.authService.signout(user);
  }

  @Get('refresh-tokens')
  @UseGuards(RefreshTokenGuard)
  async refreshTokens(@CurrentUser() user: UserSessionDto) {
    const userEntity = await this.authService.findUserById(user);
    if (!userEntity) {
      throw new InternalServerErrorException(ErrorMessage.UserNotExists);
    }

    const device = { deviceId: user.deviceId };
    const tokens = await this.authService.authenticate(userEntity, device);

    return AuthDto.from(tokens);
  }

  @Post('change-password')
  @RequirePermissions(UserPermissions.ChangePassword)
  @UseGuards(JwtPermissionsGuard)
  async changePassword(
    @CurrentUser() user: UserSessionDto,
    @Body() body: ChangePasswordForm,
  ) {
    if (body.newPassword !== body.confirmNewPassword) {
      throw new InternalServerErrorException(ErrorMessage.BadPassword);
    }
    await this.authService.changePassword(user, body);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordForm) {
    const userEntity = await this.authService.findUserByEmail(body);
    if (!userEntity) {
      throw new InternalServerErrorException(ErrorMessage.UserNotExists);
    }

    const resetToken = this.authService.generateResetToken(userEntity, body);
    const resetCode = this.authService.generateResetCode();

    const messageInfo = await this.authService.sendResetCodeToUserByEmail(
      userEntity,
      resetCode,
    );

    if (!messageInfo) {
      throw new InternalServerErrorException(ErrorMessage.FailedToSendMessage);
    }

    const hashedResetCode = this.authService.hashResetCode(resetCode);

    await this.authService.createDevice(userEntity, body, hashedResetCode);

    return resetToken;
  }

  @Post('verify-reset-code')
  @UseGuards(ResetTokenGuard)
  async verifyResetCode(
    @CurrentUser() user: UserResetTokenDto,
    @Body() body: VerifyResetCodeForm,
  ) {
    return await this.authService.verifyUserResetCode(user, body.code);
  }

  @Post('reset-password')
  @UseGuards(ResetTokenGuard)
  async resetPassword(
    @CurrentUser() user: UserResetTokenDto,
    @Body() body: ResetPasswordForm,
  ) {
    if (body.password !== body.confirmPassword) {
      throw new InternalServerErrorException(ErrorMessage.BadPassword);
    }
    return await this.authService.resetUserPassword(user, body);
  }
}
