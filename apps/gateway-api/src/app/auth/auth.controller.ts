import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { ErrorMessage } from '../../enums/error-message.enum';
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
  }
}
