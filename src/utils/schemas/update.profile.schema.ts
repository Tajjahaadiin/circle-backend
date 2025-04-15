import Joi from 'joi';
import { UpdateProfileDTO, UpdateUserDTO } from '../../dtos/user.dto';

export const updateProfileSchema = Joi.object<UpdateProfileDTO>({
  fullName: Joi.string().max(100).required(),
  username: Joi.string().min(4).max(12).required(),
  bio: Joi.string().max(100),
  avatarUrl: Joi.string().optional().allow(''),
  bannerUrl: Joi.string().optional().allow(''),
});
