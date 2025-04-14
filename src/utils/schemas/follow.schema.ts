import Joi from 'joi';
import { CreateFollowDTO, DeleteFollowDTO } from '../../dtos/follow.dto';

export const createFollowSchema = Joi.object<CreateFollowDTO>({
  followedId: Joi.string().uuid().required(),
});

export const deleteFollowSchema = Joi.object<DeleteFollowDTO>({
  followedId: Joi.string().uuid().required(),
});
