interface Token {
  resetToken: string;
}

export class ForgotDto {
  resetToken: string;

  static from(data: Token) {
    if (!data) {
      return;
    }

    const it = new ForgotDto();
    it.resetToken = data.resetToken;

    return it;
  }
}
