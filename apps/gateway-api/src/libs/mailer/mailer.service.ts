import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  constructor() {}

  async sendEmail(email: string, resetCode: number) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      secure: false,
      auth: {
        user: 'aviafinders@gmail.com',
        pass: 'epun tshr rrpd zrhy',
      },
    });

    const mailOptions = {
      from: 'aviafinders@gmail.com',
      to: email,
      subject: 'Password Reset',
      text: `Your verification code: ${resetCode}`,
    };

    return await transporter.sendMail(mailOptions);
  }
}
