import Joi from 'joi';
import { CreateLikeDTO, DeleteLikeDTO } from '../../dtos/like.dto';
import { CreateFollowedDTO, DeleteFollowedDTO } from '../../dtos/follow.dto';

export const createFollowSchema = Joi.object<CreateFollowedDTO>({
  followedId: Joi.string().uuid(),
});

export const deleteFollowSchema = Joi.object<DeleteFollowedDTO>({
  followedId: Joi.string().uuid(),
});
