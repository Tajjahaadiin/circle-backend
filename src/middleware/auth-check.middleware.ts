import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// Define a type for the user payload in the JWT
export interface UserPayload {
  id: string;
  // Add other properties from your JWT payload if needed (e.g., email, username)
}
export function authCheck(req: Request, res: Response, next: NextFunction) {
  /* #swagger.security = [{
            "bearerAuth": []
    }] */

  let token = req.headers['authorization'] || '';

  if (token.split(' ').length > 1) {
    token = token.split(' ')[1];
  }

  const jwtSecret = process.env.JWT_SECRET || '';
  /*  //version 1
  const user = jwt.verify(token, jwtSecret);

  if (!user) {
    res.status(401).json({
      message: 'Unauthorized!',
    });
    return;
  }
  (req as any).user = user;
  next(); */

  //version 2
  try {
    const decoded = jwt.verify(token, jwtSecret) as UserPayload;
    console.log('jwtDeconded:', decoded);
    (req as any).user = decoded;
    // Explicitly type the user object
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Unauthorized!',
    });
    return;
  }
}
