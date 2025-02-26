import { User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { getLoginIdentifier } from '../lib/loginIdentifier';
import AuthService from '../services/auth.service';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from '../utils/schemas/auth.schema';
import { BadRequestError } from '../lib/error';
import userService from '../services/user.service';
import jwt from 'jsonwebtoken';
import { transporter } from '../lib/nodemailer';
import bcrypt from 'bcrypt';

async function login(req: Request, res: Response, next: NextFunction) {
  /* #swagger.requestBody= {
        required: true,
        content: {
          "application/json":{
            schema: {
              $ref: "#/components/schema/LoginDTO"
            }
          }
        }
    } */

  try {
    const loginIdentifier = getLoginIdentifier(req);
    // console.log(loginIdentifier);
    const { password } = await loginSchema.validateAsync(req.body);
    if (!loginIdentifier) {
      throw new BadRequestError('provide either email or username');
    }
    const result = await AuthService.login(loginIdentifier as string, password);
    res.status(200).json(result);
  } catch (error: any) {
    console.error('login error:', error);
    res.status(401).json({ message: error.message });
    next(error);
  }
}
async function register(req: Request, res: Response, next: NextFunction) {
  /*  #swagger.requestBody = {
              required: true,
              content: {
                  "application/json": {
                      schema: {
                          $ref: "#/components/schemas/RegisterDTO"
                      }
                  }
              }
          }
      */

  try {
    const userData: User = req.body;
    const validBody = await registerSchema.validateAsync(userData);
    const result = await AuthService.register(validBody);
    res.status(201).json(result);
  } catch (error: any) {
    console.error('Register Error', error);
    res.status(400).json({ message: error });
    next();
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
async function check(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = (req as any).user;
    console.log('payload', payload);
    const user = await userService.getUserById(payload.id);
    console.log(user);
    if (!user) {
      res.status(404).json({
        message: 'User not found!',
      });
      return;
    }
    const { password: unusedPassword, ...userResponse } = user;
    console.log(userResponse);
    res
      .status(200)
      .json({ message: 'User check success!', data: { userResponse } });
  } catch (error) {
    res.json(error);
    next(error);
  }
}
async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  /*  #swagger.requestBody = {
              required: true,
              content: {
                  "application/json": {
                      schema: {
                          $ref: "#/components/schemas/ForgotPasswordDTO"
                      }
                  }
              }
          }
      */

  try {
    const body = req.body;
    const { email } = await forgotPasswordSchema.validateAsync(body);

    const jwtSecret = process.env.JWT_SECRET || '';

    const token = jwt.sign({ email }, jwtSecret, {
      expiresIn: '2 days',
    });

    const frontendUrl = process.env.FRONTEND_BASE_URL || '';
    const resetPasswordLink = `${frontendUrl}/reset-password?token=${token}`;
    console.log(resetPasswordLink, 'reset pasword link');

    const mailOptions = {
      from: `${process.env.NODEMAILER_USER_EMAIL}`,
      to: email,
      subject: 'Circe | Forgot Password',
      html: `
      <h1>This is link for reset password:</h1>
      <a href="${resetPasswordLink}">${resetPasswordLink}</a>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({
      message: 'Forgot password link sent!',
    });
  } catch (error) {
    next(error);
  }
}

async function resetPassword(req: Request, res: Response, next: NextFunction) {
  /*  #swagger.requestBody = {
                  required: true,
                  content: {
                      "application/json": {
                          schema: {
                              $ref: "#/components/schemas/ResetPasswordDTO"
                          }
                      }
                  }
              }
          */

  try {
    const payload = (req as any).user;
    const body = req.body;
    const { oldPassword, newPassword } =
      await resetPasswordSchema.validateAsync(body);

    if (oldPassword === newPassword) {
      res.status(400).json({
        message: 'Password cannot be the same as previous!',
      });
      return;
    }

    const user = await userService.getUserByEmail(payload.email);

    if (!user) {
      res.status(404).json({
        message: 'User not found!',
      });
      return;
    }

    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      user.password,
    );

    if (!isOldPasswordCorrect) {
      res.status(400).json({
        message: 'Old password is not correct!',
      });
      return;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const { password, ...updatedUserPassword } =
      await AuthService.resetPassword(user.email, hashedNewPassword);

    res.status(200).json({
      message: 'Reset password success!',
      data: { ...updatedUserPassword },
    });
  } catch (error) {
    next(error);
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
  check,
  forgotPassword,
  resetPassword,
};
