import { Follow } from '@prisma/client';

// DTO for creating a follow relationship
export type CreateFollowDTO = {
  followedId: string;
};

// DTO for deleting a follow relationship
export type DeleteFollowDTO = {
  followedId: string;
};

//  DTO for querying follows (e.g., getting followers or followings)
export type GetFollowsQueryDTO = {
  userId: string; // The user whose followers or followings you want to retrieve
};
