import { Like, Profile, Thread } from '@prisma/client';
import { User } from '@prisma/client';

export type CreateThreadDTO = Pick<Thread, 'content' | 'images'>;
export type ThreadDTO = Thread & {
  user: User & {
    profile: Profile;
  };
  likes: Like;
};
export type PaginationDTO = {
  limit: number;
  startIndex: number;
};
