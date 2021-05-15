import Joi from 'joi';
import { password } from './custome.validation';

export const registerValidate = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    passwordConfirmation: Joi.any()
      .valid(Joi.ref('password'))
      .required()
      .custom(password),
    name: Joi.string().required(),
    username: Joi.string().required(),
    role: Joi.string().required(),
    companyName: Joi.string(),
    address: Joi.string(),
    phone: Joi.string()
  })
};

export const loginValidate = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required()
  })
};

export const logoutValidate = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required()
  })
};

export const refreshTokensValidate = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required()
  })
};

export const forgotPasswordValidate = {
  body: Joi.object().keys({
    email: Joi.string().email().required()
  })
};

export const resetPasswordValidate = {
  query: Joi.object().keys({
    token: Joi.string().required()
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password)
  })
};

export const verifyEmailValidate = {
  query: Joi.object().keys({
    token: Joi.string().required()
  })
};
