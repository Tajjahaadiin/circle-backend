import Joi from 'joi';
import { CreateThreadDTO, UpdateThreadDTO } from '../../dtos/thread.dto';

export const createThreadSchema = Joi.object<CreateThreadDTO>({
  content: Joi.string().max(280),
  images: Joi.string(),
});
export const updateThreadSchema = Joi.object<UpdateThreadDTO>({
  content: Joi.string().max(280),
  images: Joi.string(),
});
