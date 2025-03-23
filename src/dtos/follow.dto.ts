import { Follow } from '@prisma/client';

export type CreateFollowedDTO = Pick<Follow, 'followedId'>;
export type DeleteFollowedDTO = Pick<Follow, 'followedId'>;
export type CreateFollowingDTO = Pick<Follow, 'followingId'>;
export type DeleteFollowingDTO = Pick<Follow, 'followingId'>;
