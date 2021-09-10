// Packages
import { createTransport } from 'nodemailer';

// Configs
import config from '../config/config';

// Utils
import catchAsync from './catchAsync';

export const transport = createTransport(config.email.smtp);

/**
 * @desc    Send an email
 * @param   { String } to - Send to
 * @param   { String } subject - Mail subject
 * @param   { String } text - Mail body
 * @returns { Promise }
 */
export const sendEmail = catchAsync(async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
});

/**
 * @desc    Send reset password email
 * @param   { String } to - Mail to
 * @param   { String } token - Reset password token
 * @returns { Promise }
 */
export const sendResetPasswordEmail = catchAsync(async (to, token) => {
  const subject = 'Reset password';
  const resetPasswordUrl = `/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;

  await sendEmail(to, subject, text);
});

/**
 * @desc    Send After Reset Password email
 * @param   { String } to - Mail to
 * @returns { Promise }
 */
export const sendAfterResetPasswordMessage = catchAsync(async (to) => {
  const subject = 'Password Reset Successfully';
  const text = `Your password has successfully been reset.
  Do not hesitate to contact us if you have any questions.`;

  await sendEmail(to, subject, text);
});

/**
 * @desc    Send verification email
 * @param   { String } to - Mail to
 * @param   { String } token - Verify token
 * @returns { Promise }
 */
export const sendVerificationEmail = catchAsync(async (to, token) => {
  const subject = 'Email Verification';
  const verificationEmailUrl = `/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;

  await sendEmail(to, subject, text);
});
