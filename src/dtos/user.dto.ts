import { Profile, User } from '@prisma/client';
type UserProfile = User & {
  fullName: Profile['fullName'];
};
export type CreateUserDTO = Pick<
  UserProfile,
  'email' | 'username' | 'password' | 'fullName'
>;

export type UpdateUserDTO = Pick<UserProfile, 'email' | 'username'>;
