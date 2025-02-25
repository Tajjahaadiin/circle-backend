import { NextFunction, Request, Response } from 'express';
import userService from '../services/user.service';
import { BadRequestError } from '../lib/error';
import {
  createUserSchema,
  updateUserSchema,
} from '../utils/schemas/user.schema';
import { error } from 'console';

class UserController {
  async getUsers(req: Request, res: Response) {
    try {
      const result = await userService.getUsers();
      res.status(200).json(result);
    } catch (error: any) {
      res.json({ message: error.message });
    }
  }
  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await userService.getUserById(id);
      res.status(200).json(result);
    } catch (error: any) {
      console.error(error.message);
      res.json(error);
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const body = req.body;
      const data = await createUserSchema.validateAsync(body);

      const result = await userService.createUser(data);
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  async updateUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const body = req.body;
      const user = await userService.getUserById(id);

      console.log('clientId', id);
      if (!user) {
        throw new Error('user not found');
      }
      const { email, username } = await updateUserSchema.validateAsync(body);
      console.log(email, username);
      if (email != '') {
        user.email = email;
      }

      if (username != '') {
        user.username = username;
      }
      console.log(user);
      const result = await userService.updateUserById(id, user);
      res.status(200).json(result);
    } catch (error) {
      res.json(error);
      next(error);
    }
  }
  async deleteUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await userService.deleteUserByid(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}
export default new UserController();
