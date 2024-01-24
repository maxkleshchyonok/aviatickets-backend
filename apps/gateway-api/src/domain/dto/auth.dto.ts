import { User } from '@prisma/client';
import { UserDto } from './user.dto';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthDto {
  accessToken: string;
  refreshToken: string;
  user: UserDto;

  static from(data: Tokens & { user: User }) {
    if (!data) {
      return;
    }

    const it = new AuthDto();
    it.accessToken = data.accessToken;
    it.refreshToken = data.refreshToken;
    it.user = UserDto.fromEntity(data.user);

    return it;
  }
}
