import Joi from 'joi';
import { CreateUserDTO, UpdateUserDTO } from '../../dtos/user.dto';

export const createUserSchema = Joi.object<CreateUserDTO>({
  fullName: Joi.string().max(100).required(),
  email: Joi.string().email().required(),
  username: Joi.string().min(4).max(12).required(),
  password: Joi.string().min(8).required(),
});

export const updateUserSchema = Joi.object<UpdateUserDTO>({
  email: Joi.string().email().required(),
  username: Joi.string().min(4).max(12).required(),
});
