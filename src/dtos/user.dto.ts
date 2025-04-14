import { User as PrismaUser } from '@prisma/client';

export interface User {
  username: string;
  email: string;
  password: string;
}
export interface Profile {
  fullName: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
  bio: string | null;
}

export type UserProfile = User & {
  fullName: Profile['fullName'];
};
export type UpdateProfileDTO = Pick<User, 'username'> &
  Pick<Profile, 'avatarUrl' | 'bio' | 'fullName'>;
export type userCreateDTO = User & {
  fullName: Profile['fullName'];
};

export type userDTO = {
  user: PrismaUser & {
    profile: Profile;
    followersCount?: string;
    followingCount?: string;
  };
  token: string;
};
export type UpdateUserDTO = Pick<UserProfile, 'email' | 'username'>;
