import Joi from 'joi';
import { CreateThreadDTO } from '../../dtos/thread.dto';

export const createThreadSchema = Joi.object<CreateThreadDTO>({
  content: Joi.string().max(280),
  images: Joi.string(),
});
