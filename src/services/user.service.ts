import { prisma } from '../lib/prisma';

import bcrypt from 'bcrypt';
import {
  userCreateDTO,
  UpdateUserDTO,
  UserProfile,
  User,
} from '../dtos/user.dto';

const createUser = async (data: userCreateDTO) => {
  const { fullName, password, email, username } = data;

  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exist.');
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        profile: {
          create: {
            fullName,
          },
        },
      },
    });
    return newUser;
  } catch (error: any) {
    console.error('createError: creating user', error);
    if (error.message === 'User with this email already exist.') {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }
};
const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
    return user;
  } catch (error: any) {
    throw new Error('failed to get user by email');
  }
};
const getUserByname = async (username: string) => {
  try {
    const user = await prisma.user.findMany({
      where: { username },
      include: { profile: true },
    });
    return user;
  } catch (error: any) {
    throw new Error('failed to get user by name');
  }
};
const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
    return user;
  } catch (errror) {
    console.error('Error get user By Id:', errror);
    throw new Error('Failed to get users by Id');
  }
};
const getUser = async () => {
  try {
    const user = await prisma.user.findMany();
    return user;
  } catch (error) {
    console.error('Error getting user', error);
    throw new Error('Failed to get user');
  }
};

const getUserSearch = async (q?: string) => {
  if (q) {
    return await prisma.user.findMany({
      orderBy: [
        {
          profile: { fullName: 'asc' },
        },
      ],
      include: {
        profile: true,
      },
      where: {
        OR: [
          {
            profile: {
              fullName: {
                startsWith: q,
                mode: 'insensitive',
              },
            },
          },
          {
            profile: {
              fullName: {
                contains: q,
              },
            },
          },
        ],
      },
    });
  }
};
const deleteUserById = async (id: string) => {
  try {
    const isUserExist = await getUserById(id);
    if (!isUserExist || null || undefined) {
      throw new Error('deleted user not exist');
    }
    const user = await prisma.user.delete({ where: { id } });
    return user;
  } catch (error: any) {
    console.error(`Error deleting user ${error}`);
    throw new Error(`failed to delete user: ${error?.message} `);
  }
};
const updateUserById = async (
  id: string,
  userResponse: User,
  userData: UpdateUserDTO,
) => {
  try {
    console.log(userData, userResponse);
    const { email, username } = userResponse;
    if (userData.email != '') {
      userResponse.email = userData.email;
    }
    if (userData.username != '') {
      userResponse.username = userData.username;
    }

    const updateUser = await prisma.user.update({
      where: {
        email,
      },
      data: {
        email: userResponse.email,
        username: userResponse.username,
      },
    });
    return updateUser;
  } catch (error: any) {
    console.error('Error updating user', error);
    throw new Error(`Failed to Updating user: ${error.message}`);
  }
};

export default {
  createUser,
  getUserByEmail,
  getUserById,
  getUser,
  getUserSearch,
  deleteUserById,
  updateUserById,
};
