import { createTransport } from 'nodemailer';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';
dotenv.config();

@Injectable()
export class MailService {
  private appURL: string;
  private from: string;
  private smtpHost: string;
  private smtpPort: number;
  private smtpUser: string;
  private smtpPass: string;
  constructor(private readonly configService: ConfigService) {
    this.appURL = process.env.APP_URL;

    this.from = process.env.EMAIL_FROM;
  }

  async compileTemplate(data: any, templatePath: string): Promise<string> {
    const filePath = path.join(process.cwd(), templatePath);
    const source = await fs.promises.readFile(filePath, 'utf-8');
    const template = Handlebars.compile(source);
    return template(data);
  }

  async sendEmail(to: string, subject: string, html: string): Promise<any> {
    const transport = createTransport({
      host: process.env.EMAIL_SMTP_HOST,
      port: process.env.EMAIL_SMTP_PORT,
      secure: true,
      logger: true,
      debugger: true,
      secureConnection: false,
      auth: {
        user: process.env.EMAIL_SMTP_USER,
        pass: process.env.EMAIL_SMTP_PASS,
      },
      tls: {
        rejectUnAuthorized: true,
      },
    });
    // Create the email options and body
    const mailOptions = {
      from: `Bshop < ${this.from} >`,
      to,
      subject,
      html,
    };

    // Set up the email options and delivering it
    return await transport.sendMail(mailOptions);
  }

  async sendResetPasswordEmail(to: string, token: string): Promise<any> {
    const subject = 'Reset Password';
    const resetPasswordURL = `${this.appURL}/auth/reset-password?token=${token}`;
    // const text = `Dear user,
    // To reset your password, click on this link: ${resetPasswordURL}
    // If you did not request any password resets, then ignore this email.`;
    const text = await this.compileTemplate(
      { resetPasswordURL },
      'src/views/resetPassword.hbs',
    );
    return await this.sendEmail(to, subject, text);
  }

  async sendAfterResetPasswordEmail(to: string): Promise<any> {
    const subject = 'Password Reset Successfully';
    const text = `Dear user,
    Your password has been reset successfully.`;

    return await this.sendEmail(to, subject, text);
  }

  async sendVerifyEmail(to: string, token: string): Promise<any> {
    const subject = 'Email Verification';
    const verifyEmailURL = `${this.appURL}/auth/email-verified?token=${token}`;
    const text = await this.compileTemplate(
      { verifyEmailURL },
      'src/views/index.hbs',
    );

    return await this.sendEmail(to, subject, text);
  }

  async sendForgotPasswordEmail(to: string, token: string): Promise<any> {
    const subject = 'Forgot Password';
    const forgotPasswordURL = `${this.appURL}/forgot-password?token=${token}`;
    const text = `Dear user,
    To reset your password, click on this link: ${forgotPasswordURL}
    If you did not request any password resets, then ignore this email.`;

    return await this.sendEmail(to, subject, text);
  }
}
