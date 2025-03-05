import Joi from 'joi';
import { CreateReplyDTO } from '../../dtos/reply.dto';
export const createReplySchema = Joi.object<CreateReplyDTO>({
  content: Joi.string().max(280),
});
