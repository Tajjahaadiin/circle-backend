import Joi from 'joi';
import { CreateLikeDTO, DeleteLikeDTO } from '../../dtos/like.dto';

export const createLikeSchema = Joi.object<CreateLikeDTO>({
  threadId: Joi.string().uuid(),
});

export const deleteLikeSchema = Joi.object<DeleteLikeDTO>({
  threadId: Joi.string().uuid(),
});
