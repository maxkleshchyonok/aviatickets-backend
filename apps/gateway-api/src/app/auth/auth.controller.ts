import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { AuthDto } from 'api/domain/dto/auth.dto';
import { ErrorMessage } from 'api/enums/error-message.enum';
import { AuthService } from './auth.service';
import { SignUpForm } from './dto/signup.form';

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

    const payload = {
      id: newUserEntity.id,
      roleId: newUserEntity.roleId,
      roleType: newUserEntity.roleType,
    };

    const tokens = this.authService.generateTokens(payload);
    await this.authService.setRefreshToken(payload.id, tokens.refreshToken);

    return AuthDto.from({
      ...tokens,
      user: newUserEntity,
    });
  }
}
