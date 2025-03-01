import { Like } from '@prisma/client';

export type CreateLikeDTO = Pick<Like, 'threadId'>;

export type DeleteLikeDTO = Pick<Like, 'threadId'>;
