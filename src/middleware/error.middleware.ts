import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof Joi.ValidationError) {
    res.status(400).json({
      message: err.details[0].message,
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    res.status(400).json({
      message: err.message,
    });
    return;
  }

  res
    .status(500)
    .json({ message: `Internal Server Error! Error: ${JSON.stringify(err)}` });
}
