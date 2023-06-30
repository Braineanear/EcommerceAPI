import { google } from 'googleapis';
import { createTransport } from 'nodemailer';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private appURL: string;
  private clientID: string;
  private clientSecret: string;
  private redirectUri: string;
  private RefreshToken: string;
  private from: string;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.appURL = this.configService.get<string>(
      'app.url',
    );
    this.clientID = this.configService.get<string>(
      'email.client.id',
    );
    this.clientSecret = this.configService.get<string>(
      'email.client.secret',
    );
    this.redirectUri = this.configService.get<string>(
      'email.RedirectUri',
    );
    this.RefreshToken = this.configService.get<string>(
      'email.RefreshToken',
    );
    this.from = this.configService.get<string>(
      'email.from',
    );

  }

  async sendEmail (to: string, subject: string, text: string): Promise<any> {
    const OAuth2Client = new google.auth.OAuth2(
      this.clientID,
      this.clientSecret,
      this.redirectUri,
    );

    OAuth2Client.setCredentials({ refresh_token: this.RefreshToken });

      // Generate the accessToken on the fly
      const accessToken = await OAuth2Client.getAccessToken();

      // Create the email envelope (transport)
      const transport = createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: this.from,
          clientId: this.clientID,
          clientSecret: this.clientSecret,
          refreshToken: this.RefreshToken,
          accessToken: accessToken
        }
      });

      // Create the email options and body
      const mailOptions = {
        from: `Mahmoud Yasser - Ecommerce API < ${this.from} >`,
        to,
        subject,
        text
      };

      // Set up the email options and delivering it
      return await transport.sendMail(mailOptions);
  }

  async sendResetPasswordEmail (to: string, token: string): Promise<any> {
    const subject = 'Reset Password';
    const resetPasswordURL = `${this.appURL}/reset-password?token=${token}`;
    const text = `Dear user,
    To reset your password, click on this link: ${resetPasswordURL}
    If you did not request any password resets, then ignore this email.`;

    return await this.sendEmail(to, subject, text);
  }

  async sendAfterResetPasswordEmail (to: string): Promise<any> {
    const subject = 'Password Reset Successfully';
    const text = `Dear user,
    Your password has been reset successfully.`;

    return await this.sendEmail(to, subject, text);
  }

  async sendVerifyEmail (to: string, token: string): Promise<any> {
    const subject = 'Email Verification';
    const verifyEmailURL = `${this.appURL}/verify-email?token=${token}`;
    const text = `Dear user,
    To verify your email, click on this link: ${verifyEmailURL}
    If you did not request any email verification, then ignore this email.`;

    return await this.sendEmail(to, subject, text);
  }

  async sendForgotPasswordEmail (to: string, token: string): Promise<any> {
    const subject = 'Forgot Password';
    const forgotPasswordURL = `${this.appURL}/forgot-password?token=${token}`;
    const text = `Dear user,
    To reset your password, click on this link: ${forgotPasswordURL}
    If you did not request any password resets, then ignore this email.`;

    return await this.sendEmail(to, subject, text);
  }
}
