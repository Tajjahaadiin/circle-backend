import Joi from 'joi';
import {
  RegisterDTO,
  LoginDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
} from '../../dtos/auth.dtos';

export const loginSchema = Joi.object<LoginDTO>({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});
export const registerSchema = Joi.object<RegisterDTO>({
  fullName: Joi.string().max(100).required(),
  email: Joi.string().email().required(),
  username: Joi.string().min(4).max(12),
  password: Joi.string().min(8).required(),
});
export const forgotPasswordSchema = Joi.object<ForgotPasswordDTO>({
  email: Joi.string().email().required(),
});
export const resetPasswordSchema = Joi.object<ResetPasswordDTO>({
  oldPassword: Joi.string().min(8).required(),
  newPassword: Joi.string().min(8).required(),
});
