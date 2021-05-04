import { createTransport } from 'nodemailer';
import config from '../config/config';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

export const transport = createTransport(config.email.smtp);

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
export const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  const [err] = await catchAsync(transport.sendMail(msg));

  if (err) {
    throw new AppError(err, 500);
  }
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
export const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  const resetPasswordUrl = `/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  const [err] = await catchAsync(sendEmail(to, subject, text));

  if (err) {
    throw new AppError(err, 500);
  }
};

export const sendAfterResetPasswordMessage = async (to) => {
  const subject = 'Password Reset Successfully';
  const text = `Your password has successfully been reset.
  Do not hesitate to contact us if you have any questions.`;
  const [err] = await catchAsync(sendEmail(to, subject, text));

  if (err) {
    throw new AppError(err, 500);
  }
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
export const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  const verificationEmailUrl = `/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  const [err] = await catchAsync(sendEmail(to, subject, text));

  if (err) {
    throw new AppError(err, 500);
  }
};
