interface Tokens {
  accessToken: string;
}

export class AuthDto {
  accessToken: string;

  static from(data: Tokens) {
    if (!data) {
      return;
    }

    const it = new AuthDto();
    it.accessToken = data.accessToken;

    return it;
  }
}
