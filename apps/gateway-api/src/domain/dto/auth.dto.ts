interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthDto {
  accessToken: string;
  refreshToken: string;

  static from(data: Tokens) {
    if (!data) {
      return;
    }

    const it = new AuthDto();
    it.accessToken = data.accessToken;
    it.refreshToken = data.refreshToken;

    return it;
  }
}
