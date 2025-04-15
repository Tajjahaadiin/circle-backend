import { NextFunction, Request, Response } from 'express';
import { userCreateDTO } from '../dtos/user.dto';
import userService from '../services/user.service';
import {
  createUserSchema,
  updateUserSchema,
} from '../utils/schemas/user.schema';
import { prisma } from '../lib/prisma';

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await userService.getUser();
    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};
export const suggestedtUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const loggedInUserId = (req as any).user.id;
    const limit = 5;
    console.log('loggeduser', loggedInUserId);
    const result = await userService.getUsersNotFollowingOrderedByFollowers(
      loggedInUserId,
      limit,
    );
    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

export const getUserSearch = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const q = req.query.q as string;
    if (!q.trim()) {
      res.json([]);
      return;
    }
    const loggedInUserId = (req as any).user.id;
    console.log('loggedInuserId', loggedInUserId);
    const users = await userService.getUserSearch(q, loggedInUserId);

    res.json(users);
  } catch (error) {
    next(error);
  }
};
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userID = req.params.id;
    const user = await userService.getUserById(userID);
    if (!user || '' || null) {
      throw new Error('user not found');
    }
    const followersCount = user._count.followers;
    const followingCount = user._count.followings;

    res.status(200).json({ user: { ...user, followersCount, followingCount } });
  } catch (error: any) {
    console.error(error.message);
    if (error == 'user not found ') {
      res.status(404).json(error);
    }
    res.json(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const clientData: userCreateDTO = req.body;
    const validData = await createUserSchema.validateAsync(clientData);
    const newuser = await userService.createUser(validData);

    res.status(201).json({
      message: 'user created successfully',
      newuser,
    });
  } catch (error: any) {
    res.status(400).json(`Error:, ${error} }`);
    next(error);
  }
};
export const updateUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userID = req.params.id;
    const body = req.body;
    const userRespose = await userService.getUserById(userID);
    if (!userRespose) {
      throw new Error('user not found');
    }
    const userData = await updateUserSchema.validateAsync(body);

    const result = await userService.updateUserById(
      userID,
      userRespose,
      userData,
    );
    res.status(200).json({ message: 'User Data Updated', result });
  } catch (error) {
    res.status(400).json(`Error:, ${error} }`);
    next(error);
  }
};
export const deleteUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const user = await userService.deleteUserById(id);
    console.log('deleted user', user);
    res.json({ message: 'user deleted succesfully', user });
  } catch (error: any) {
    res.status(404).json({ message: `Error: ${error.message}` });
    next(error);
  }
};
