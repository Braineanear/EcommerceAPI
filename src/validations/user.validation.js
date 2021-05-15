import Joi from 'joi';
import { password, objectId } from './custome.validation';

export const createUserValidate = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    passwordConfirmation: Joi.string().required().custom(password),
    username: Joi.string().required(),
    name: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin', 'seller')
  })
};

export const getUsersValidate = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

export const getUserValidate = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId)
  })
};

export const updateUserValidate = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId)
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      name: Joi.string()
    })
    .min(1)
};

export const deleteUserValidate = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId)
  })
};
