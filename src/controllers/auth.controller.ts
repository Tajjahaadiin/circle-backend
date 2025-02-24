import { Request, Response } from 'express';
import AuthService from '../services/auth.service';
import { User } from '@prisma/client';
import { getLoginIdentifier } from '../lib/loginIdentifier';
import { error } from 'console';

async function login(req: Request, res: Response) {
  try {
    const loginIdentifier = getLoginIdentifier(req);
    // console.log(loginIdentifier);
    const { password } = req.body;
    if (!loginIdentifier) {
      res.status(401).json({ message: 'provide either email or username' });
    }
    const result = await AuthService.login(loginIdentifier as string, password);
    res.status(200).json(result);
  } catch (error: any) {
    console.error('login error:', error);
    res.status(401).json({ message: error.message });
  }
}
async function register(req: Request, res: Response) {
  try {
    const userData: User = req.body;
    const result = await AuthService.register(userData);
    res.status(201).json(result);
  } catch (error: any) {
    console.error('Register Error', error);
    res.status(400).json({ message: error.message });
  }
}
async function logout(req: Request, res: Response) {
  try {
    //fill with Logic to invalidate token or session
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error: any) {
    console.error('Logout error', error);
    res.status(500).json({ message: 'Logout failed' });
  }
}

async function protectedRoute(req: Request, res: Response) {
  try {
    //fill with user data from req.user (set by authentication middleware)
  } catch (error: any) {
    console.error('Protected route error:', error);
    res.status(500).json({ message: 'Protected route acces failed' });
  }
}

export default {
  login,
  logout,
  protectedRoute,
  register,
};
