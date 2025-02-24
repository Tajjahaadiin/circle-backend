import { Profile, User } from '@prisma/client';

type UserProfile = User & {
  fullName: Profile['fullName'];
};
export type LoginDTO = Pick<User, 'email' | 'password' | 'username'>;

export type RegisterDTO = Pick<
  UserProfile,
  'email' | 'username' | 'password' | 'fullName'
>;

export type ForgotPasswordDTO = Pick<User, 'email'>;
export type ResetPasswordDTO = {
  oldPassword: string;
  newPassword: string;
};
